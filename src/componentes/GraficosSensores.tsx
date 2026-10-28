import estilos from './GraficosSensores.module.css'
import { memo, useEffect, useMemo, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'
import { useDadosSensor } from '../hooks/useDadosSensor'
import { INTERVALOS, type IntervaloTempoTipo } from '../tipos/Sensor'
import { SeletorIntervalo } from './SeletorIntervalo'
import {
  montarSerie,
  formatarDataCompleta,
  type CampoSensorTipo,
  type SerieGraficoTipo,
} from '../utilitarios/serieGrafico'

// Cores fixas (hex): o SVG do gráfico não enxerga variáveis CSS como var(--cor-...)
const GRAFICOS: { campo: CampoSensorTipo; titulo: string; cor: string; dominio?: [number, number] }[] = [
  { campo: 'nitrogenio', titulo: 'Nitrogênio (N)', cor: '#22c55e' },
  { campo: 'fosforo', titulo: 'Fósforo (P)', cor: '#3b82f6' },
  { campo: 'potassio', titulo: 'Potássio (K)', cor: '#f59e0b' },
  { campo: 'temperatura', titulo: 'Temperatura', cor: '#ef4444' },
  { campo: 'umidade', titulo: 'Umidade', cor: '#14b8a6' },
  { campo: 'ph', titulo: 'pH do Solo', cor: '#a855f7', dominio: [0, 14] },
  { campo: 'condutividade', titulo: 'Condutividade Elétrica (EC)', cor: '#6366f1' },
  { campo: 'luminosidade', titulo: 'Luminosidade', cor: '#eab308' },
]

type GraficoLinhaProps = {
  serie: SerieGraficoTipo
  campo: CampoSensorTipo
  titulo: string
  cor: string
  dominio?: [number, number]
}

// memo: só redesenha quando a série realmente muda
const GraficoLinha = memo(function GraficoLinha({ serie, campo, titulo, cor, dominio }: GraficoLinhaProps) {
  const rotulos = new Map(serie.ticks.map((tick) => [tick.x, tick.rotulo]))

  // Ponto visível só quando está sozinho (sensor ligou por pouco tempo) —
  // senão ele não apareceria, já que uma linha precisa de 2 pontos.
  const desenharPonto = (props: { cx?: number; cy?: number; index?: number }) => {
    const { cx, cy, index } = props
    const i = index ?? -1
    const anterior = serie.pontos[i - 1]?.[campo] ?? null
    const proximo = serie.pontos[i + 1]?.[campo] ?? null
    const sozinho = anterior === null && proximo === null
    if (!sozinho || cx === undefined || cy === undefined || serie.pontos[i]?.[campo] == null) {
      return <g key={`ponto-${i}`} />
    }
    return <circle key={`ponto-${i}`} cx={cx} cy={cy} r={3} fill={cor} />
  }

  return (
    <div className={estilos.cartao}>
      <p className={estilos.titulo}>{titulo}</p>
      <ResponsiveContainer width='100%' height={220}>
        <LineChart data={serie.pontos} margin={{ top: 5, right: 16, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray='3 3' vertical={false} />
          <XAxis
            type='number'
            dataKey='x'
            domain={[0, serie.fim]}
            ticks={serie.ticks.length > 0 ? serie.ticks.map((tick) => tick.x) : undefined}
            tickFormatter={(valor: number) => rotulos.get(valor) ?? ''}
            fontSize={12}
          />
          <YAxis fontSize={12} domain={dominio} width={45} />
          {serie.quebras.map((x) => (
            <ReferenceLine key={x} x={x} stroke='#cbd5e1' strokeDasharray='4 4' />
          ))}
          <Tooltip
            labelFormatter={(_rotulo, itens) => {
              const horario = itens?.[0]?.payload?.timestamp
              return typeof horario === 'number' ? formatarDataCompleta(horario) : ''
            }}
          />
          <Line
            name={titulo}
            type='monotone'
            dataKey={campo}
            stroke={cor}
            strokeWidth={2}
            dot={desenharPonto}
            activeDot={{ r: 4 }}
            isAnimationActive={false}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
})

export function GraficosSensores() {
  const [intervalo, setIntervalo] = useState<IntervaloTempoTipo>('1h')
  const { historico, carregando, erro } = useDadosSensor(intervalo)
  const [agora, setAgora] = useState(() => Date.now())

  // faz a janela de tempo "andar" mesmo com o sensor desligado
  useEffect(() => {
    const relogio = setInterval(() => setAgora(Date.now()), 30 * 1000)
    return () => clearInterval(relogio)
  }, [])

  const duracao = INTERVALOS.find((item) => item.valor === intervalo)?.milissegundos ?? null

  const serie = useMemo(
    () => montarSerie(historico, duracao, agora),
    [historico, duracao, agora],
  )

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

  if (!serie) {
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
      {serie.quebras.length > 0 && (
        <p style={{ margin: '0 0 12px 0', fontSize: 13, color: 'var(--cor-cinza-01)' }}>
          As linhas tracejadas marcam períodos em que o sensor ficou desligado (o tempo parado foi
          removido do gráfico).
        </p>
      )}
      <div className={estilos.conteinerGrade}>
        {GRAFICOS.map((grafico) => (
          <GraficoLinha key={grafico.campo} serie={serie} {...grafico} />
        ))}
      </div>
    </>
  )
}