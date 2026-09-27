import estilos from './GraficosSensores.module.css'
import { useState } from 'react'
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
import { type IntervaloTempoTipo } from '../tipos/Sensor'
import { SeletorIntervalo } from './SeletorIntervalo'

function formatarHora(timestamp: number): string {
  const data = new Date(timestamp)
  return data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

export function GraficosSensores() {
  const [intervalo, setIntervalo] = useState<IntervaloTempoTipo>('tudo')
  const { historico, carregando, erro } = useDadosSensor(intervalo)

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

  if (historico.length === 0) {
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

  const dados = historico.map((ponto) => ({
    ...ponto,
    horario: formatarHora(ponto.timestamp),
  }))

  return (
    <>
      {seletor}

      <div className={estilos.conteinerGrade}>
        <div className={estilos.cartao}>
          <p className={estilos.titulo}>Nitrogênio (N)</p>
          <ResponsiveContainer width='100%' height={220}>
            <LineChart data={dados}>
              <CartesianGrid strokeDasharray='3 3' vertical={false} />
              <XAxis dataKey='horario' fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Line
                type='monotone'
                dataKey='nitrogenio'
                stroke='var(--cor-complementar-004)'
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className={estilos.cartao}>
          <p className={estilos.titulo}>Fósforo (P)</p>
          <ResponsiveContainer width='100%' height={220}>
            <LineChart data={dados}>
              <CartesianGrid strokeDasharray='3 3' vertical={false} />
              <XAxis dataKey='horario' fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Line
                type='monotone'
                dataKey='fosforo'
                stroke='var(--cor-complementar-007)'
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className={estilos.cartao}>
          <p className={estilos.titulo}>Potássio (K)</p>
          <ResponsiveContainer width='100%' height={220}>
            <LineChart data={dados}>
              <CartesianGrid strokeDasharray='3 3' vertical={false} />
              <XAxis dataKey='horario' fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Line
                type='monotone'
                dataKey='potassio'
                stroke='var(--cor-complementar-008)'
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className={estilos.cartao}>
          <p className={estilos.titulo}>Temperatura</p>
          <ResponsiveContainer width='100%' height={220}>
            <LineChart data={dados}>
              <CartesianGrid strokeDasharray='3 3' vertical={false} />
              <XAxis dataKey='horario' fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Line
                type='monotone'
                dataKey='temperatura'
                stroke='var(--cor-complementar-009)'
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className={estilos.cartao}>
          <p className={estilos.titulo}>Umidade</p>
          <ResponsiveContainer width='100%' height={220}>
            <LineChart data={dados}>
              <CartesianGrid strokeDasharray='3 3' vertical={false} />
              <XAxis dataKey='horario' fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Line
                type='monotone'
                dataKey='umidade'
                stroke='var(--cor-complementar-010)'
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className={estilos.cartao}>
          <p className={estilos.titulo}>pH do Solo</p>
          <ResponsiveContainer width='100%' height={220}>
            <LineChart data={dados}>
              <CartesianGrid strokeDasharray='3 3' vertical={false} />
              <XAxis dataKey='horario' fontSize={12} />
              <YAxis fontSize={12} domain={[0, 14]} />
              <Tooltip />
              <Line
                type='monotone'
                dataKey='ph'
                stroke='var(--cor-complementar-011)'
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className={estilos.cartao}>
          <p className={estilos.titulo}>Condutividade Elétrica (EC)</p>

          <ResponsiveContainer width='100%' height={220}>
            <LineChart data={dados}>
              <CartesianGrid strokeDasharray='3 3' vertical={false} />

              <XAxis
                dataKey='horario'
                fontSize={12}
              />

              <YAxis fontSize={12} />

              <Tooltip />

              <Line
                type='monotone'
                dataKey='condutividade'
                stroke='#6366f1'
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className={estilos.cartao}>
          <p className={estilos.titulo}>Luminosidade</p>
          <ResponsiveContainer width='100%' height={220}>
            <LineChart data={dados}>
              <CartesianGrid strokeDasharray='3 3' vertical={false} />
              <XAxis dataKey='horario' fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Line
                type='monotone'
                dataKey='luminosidade'
                stroke='var(--cor-complementar-012)'
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  )
}