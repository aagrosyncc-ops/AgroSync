import { FAIXAS_IDEAIS, calcularSeveridade, type FaixaIdealTipo, type SeveridadeParametroTipo } from '../tipos/FaixasIdeais'
import type { PontoHistoricoTipo } from '../tipos/Sensor'
import type { TipoRelatorio } from '../tipos/Relatorios'

/*
  Calcula, a partir das leituras brutas, tudo o que o PDF precisa:
    - diário  -> média de cada HORA   (últimas 24 horas)
    - semanal -> média de cada DIA    (últimos 7 dias)
    - mensal  -> média de cada SEMANA (últimos 30 dias)
  mais o resumo do período (média, mínimo, máximo e situação de cada parâmetro).
*/

// Parâmetros que o sensor ainda não mede. Tire daqui quando existir o sensor de luz.
export const PARAMETROS_SEM_SENSOR: string[] = ['luminosidade']
export const FAIXAS_RELATORIO: FaixaIdealTipo[] = FAIXAS_IDEAIS.filter(
  (faixa) => !PARAMETROS_SEM_SENSOR.includes(faixa.chave),
)

type ChaveTipo = FaixaIdealTipo['chave']

export type GrupoTipo = {
  rotulo: string
  leituras: number
  medias: Record<string, number | null>
}

export type ResumoParametroTipo = {
  faixa: FaixaIdealTipo
  media: number | null
  minimo: number | null
  maximo: number | null
  severidade: SeveridadeParametroTipo | null
}

export type DadosRelatorioTipo = {
  tipo: TipoRelatorio
  inicio: number
  fim: number
  total: number
  nomeGrupo: 'Hora' | 'Dia' | 'Semana'
  grupos: GrupoTipo[]
  resumo: ResumoParametroTipo[]
}

const HORA = 60 * 60 * 1000

function inicioDoDia(ms: number): Date {
  const data = new Date(ms)
  data.setHours(0, 0, 0, 0)
  return data
}

function somarDias(data: Date, dias: number): Date {
  const nova = new Date(data)
  nova.setDate(nova.getDate() + dias)
  return nova
}

// Início da janela de cada tipo de relatório
export function inicioDoPeriodo(tipo: TipoRelatorio, agora: number): number {
  if (tipo === 'diario') return agora - 24 * HORA
  if (tipo === 'semanal') return somarDias(inicioDoDia(agora), -6).getTime()
  return somarDias(inicioDoDia(agora), -29).getTime()
}

function arredondar(valor: number, casas: number): number {
  const fator = 10 ** casas
  return Math.round(valor * fator) / fator
}

type Faixa = { inicio: number; fim: number; rotulo: string }

function montarFaixas(tipo: TipoRelatorio, inicio: number, agora: number): Faixa[] {
  const faixas: Faixa[] = []
  const dia = (data: Date) => data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })

  if (tipo === 'diario') {
    const primeira = new Date(inicio)
    primeira.setMinutes(0, 0, 0)
    for (let t = primeira.getTime(); t <= agora; t += HORA) {
      const data = new Date(t)
      const hora = `${String(data.getHours()).padStart(2, '0')}h`
      const ehHoje = data.toDateString() === new Date(agora).toDateString()
      faixas.push({ inicio: t, fim: t + HORA, rotulo: ehHoje ? hora : `${dia(data)} ${hora}` })
    }
  } else if (tipo === 'semanal') {
    for (let d = new Date(inicio); d.getTime() <= agora; d = somarDias(d, 1)) {
      const semana = d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')
      faixas.push({ inicio: d.getTime(), fim: somarDias(d, 1).getTime(), rotulo: `${dia(d)} (${semana})` })
    }
  } else {
    for (let d = new Date(inicio); d.getTime() <= agora; d = somarDias(d, 7)) {
      const fimBloco = somarDias(d, 7)
      const ultimoDia = new Date(Math.min(somarDias(fimBloco, -1).getTime(), agora))
      faixas.push({ inicio: d.getTime(), fim: fimBloco.getTime(), rotulo: `${dia(d)} a ${dia(ultimoDia)}` })
    }
  }
  return faixas
}

export function calcularRelatorio(
  leituras: PontoHistoricoTipo[],
  tipo: TipoRelatorio,
  agora: number,
): DadosRelatorioTipo | null {
  const inicio = inicioDoPeriodo(tipo, agora)
  const validas = leituras.filter((p) => p.timestamp >= inicio && p.timestamp <= agora + HORA)
  if (validas.length === 0) return null

  const faixasTempo = montarFaixas(tipo, inicio, agora)
  const chaves: ChaveTipo[] = FAIXAS_RELATORIO.map((f) => f.chave)

  const novo = () => Object.fromEntries(chaves.map((c) => [c, 0])) as Record<string, number>
  const baldes = faixasTempo.map(() => ({ n: 0, soma: novo(), cont: novo() }))
  const geral = { soma: novo(), cont: novo(), min: {} as Record<string, number>, max: {} as Record<string, number> }

  for (const ponto of validas) {
    const indice = faixasTempo.findIndex((f) => ponto.timestamp >= f.inicio && ponto.timestamp < f.fim)
    if (indice >= 0) baldes[indice].n += 1
    for (const chave of chaves) {
      const valor = ponto[chave]
      if (typeof valor !== 'number' || !Number.isFinite(valor)) continue
      if (indice >= 0) {
        baldes[indice].soma[chave] += valor
        baldes[indice].cont[chave] += 1
      }
      geral.soma[chave] += valor
      geral.cont[chave] += 1
      geral.min[chave] = Math.min(geral.min[chave] ?? valor, valor)
      geral.max[chave] = Math.max(geral.max[chave] ?? valor, valor)
    }
  }

  const casas = (chave: string) => (chave === 'ph' ? 2 : 1)

  const grupos: GrupoTipo[] = faixasTempo.map((faixa, i) => ({
    rotulo: faixa.rotulo,
    leituras: baldes[i].n,
    medias: Object.fromEntries(
      chaves.map((c) => [c, baldes[i].cont[c] > 0 ? arredondar(baldes[i].soma[c] / baldes[i].cont[c], casas(c)) : null]),
    ),
  }))

  const resumo: ResumoParametroTipo[] = FAIXAS_RELATORIO.map((faixa) => {
    const c = faixa.chave
    if (geral.cont[c] === 0) return { faixa, media: null, minimo: null, maximo: null, severidade: null }
    const media = arredondar(geral.soma[c] / geral.cont[c], casas(c))
    return {
      faixa,
      media,
      minimo: arredondar(geral.min[c], casas(c)),
      maximo: arredondar(geral.max[c], casas(c)),
      severidade: calcularSeveridade(media, faixa),
    }
  })

  return {
    tipo,
    inicio,
    fim: agora,
    total: validas.length,
    nomeGrupo: tipo === 'diario' ? 'Hora' : tipo === 'semanal' ? 'Dia' : 'Semana',
    grupos,
    resumo,
  }
}