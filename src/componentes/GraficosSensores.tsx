import estilos from './GraficosSensores.module.css'
import { memo, useMemo, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useDadosSensor } from '../hooks/useDadosSensor'
import { type IntervaloTempoTipo, type PontoHistoricoTipo } from '../tipos/Sensor'
import { SeletorIntervalo } from './SeletorIntervalo'

// Máximo de pontos desenhados por gráfico (o resto vira média)
const MAX_PONTOS = 60

type CampoTipo = Exclude<keyof PontoHistoricoTipo, 'timestamp'>

const GRAFICOS: { campo: CampoTipo; titulo: string; cor: string; dominio?: [number, number] }[] = [
  { campo: 'nitrogenio', titulo: 'Nitrogênio (N)', cor: 'var(--cor-complementar-004)' },
  { campo: 'fosforo', titulo: 'Fósforo (P)', cor: 'var(--cor-complementar-007)' },
  { campo: 'potassio', titulo: 'Potássio (K)', cor: 'var(--cor-complementar-008)' },
  { campo: 'temperatura', titulo: 'Temperatura', cor: 'var(--cor-complementar-009)' },
  { campo: 'umidade', titulo: 'Umidade', cor: 'var(--cor-complementar-010)' },
  { campo: 'ph', titulo: 'pH do Solo', cor: 'var(--cor-complementar-011)', dominio: [0, 14] },
  { campo: 'condutividade', titulo: 'Condutividade Elétrica (EC)', cor: '#6366f1' },

]

type PontoGraficoTipo = PontoHistoricoTipo & { horario: string }

// Agrupa leituras em blocos e tira a média: 720 pontos viram ~60
function reduzirPontos(lista: PontoHistoricoTipo[]): PontoHistoricoTipo[] {
  if (lista.length <= MAX_PONTOS) return lista
  const tamanho = Math.ceil(lista.length / MAX_PONTOS)
  const resultado: PontoHistoricoTipo[] = []

  for (let i = 0; i < lista.length; i += tamanho) {
    const bloco = lista.slice(i, i + tamanho)
    const media = (campo: CampoTipo) =>
      Math.round((bloco.reduce((soma, p) => soma + p[campo], 0) / bloco.length) * 10) / 10

    resultado.push({
      nitrogenio: media('nitrogenio'),
      fosforo: media('fosforo'),
      potassio: media('potassio'),
      temperatura: media('temperatura'),
      umidade: media('umidade'),
      ph: media('ph'),
      condutividade: media('condutividade'),
      luminosidade: media('luminosidade'),
      timestamp: bloco[Math.floor(bloco.length / 2)].timestamp,
    })
  }
  return resultado
}

function formatarHorario(timestamp: number, incluirDia: boolean): string {
  const data = new Date(timestamp)
  const hora = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  if (!incluirDia) return hora
  return `${data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} ${hora}`
}

type GraficoLinhaProps = {
  dados: PontoGraficoTipo[]
  campo: CampoTipo
  titulo: string
  cor: string
  dominio?: [number, number]
}

// memo: só redesenha quando os dados realmente mudam
const GraficoLinha = memo(function GraficoLinha({ dados, campo, titulo, cor, dominio }: GraficoLinhaProps) {
  return (
    <div className={estilos.cartao}>
      <p className={estilos.titulo}>{titulo}</p>
      <ResponsiveContainer width='100%' height={220}>
        <LineChart data={dados}>
          <CartesianGrid strokeDasharray='3 3' vertical={false} />
          <XAxis dataKey='horario' fontSize={12} minTickGap={40} interval='preserveStartEnd' />
          <YAxis fontSize={12} domain={dominio} />
          <Tooltip />
          <Line
            type='monotone'
            dataKey={campo}
            stroke={cor}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
})

export function GraficosSensores() {
  const [intervalo, setIntervalo] = useState<IntervaloTempoTipo>('1h')
  const { historico, carregando, erro } = useDadosSensor(intervalo)

  const dados = useMemo<PontoGraficoTipo[]>(() => {
    const incluirDia = intervalo === '7d' || intervalo === 'tudo'
    return reduzirPontos(historico).map((ponto) => ({
      ...ponto,
      horario: formatarHorario(ponto.timestamp, incluirDia),
    }))
  }, [historico, intervalo])

  const seletor = <SeletorIntervalo valor={intervalo} aoMudar={setIntervalo} />

  if (carregando) {
    return (
      <>
        {seletor}
        <p className={estilos.mensagemEstado}>Carregando histórico do sensor...</p>
      </>
    )
  }

  if (erro) {
    return (
      <>
        {seletor}
        <p className={estilos.mensagemEstado}>Erro ao conectar ao sensor: {erro}</p>
      </>
    )
  }

  if (dados.length === 0) {
    return (
      <>
        {seletor}
        <p className={estilos.mensagemEstado}>
          Nenhum dado encontrado nesse intervalo. Assim que o ESP32 registrar leituras nesse
          período, os gráficos aparecem aqui automaticamente.
        </p>
      </>
    )
  }

  return (
    <>
      {seletor}
      <div className={estilos.conteinerGrade}>
        {GRAFICOS.map((grafico) => (
          <GraficoLinha key={grafico.campo} dados={dados} {...grafico} />
        ))}
      </div>
    </>
  )
}