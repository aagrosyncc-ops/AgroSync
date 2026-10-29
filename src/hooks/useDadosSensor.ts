import { useEffect, useState } from 'react'
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore'
import { firestore } from '@/servicos/Firebase'
import { LeituraSensorTipo } from '@/tipos/Sensor'

export function useDadosSensor() {

  const [leituraAtual, setLeituraAtual] = useState<LeituraSensorTipo | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {

    // pega só o ultimo documento gravado, ordenado do mais novo pro mais velho
    const consulta = query(
      collection(firestore, 'leituras_sensor'),
      orderBy('timestamp', 'desc'),
      limit(1),
    )

    // onSnapshot fica escutando, toda vez que o esp32 manda um dado novo
    // essa função roda de novo sozinha
    const pararDeEscutar = onSnapshot(consulta, (snapshot) => {

      if (snapshot.empty) {
        setLeituraAtual(null)
            } else {
        const dados = snapshot.docs[0].data()

        // o timestamp pode vir como Timestamp do Firestore (um objeto) ou como número puro.
        // aqui a gente garante que vira sempre um número em milissegundos,
        // pra o resto do app (Sensores, Alertas) não precisar se preocupar com isso
        const timestampBruto: any = dados.timestamp
        const timestampEmMs =
          timestampBruto && typeof timestampBruto.toMillis === 'function'
            ? timestampBruto.toMillis()
            : timestampBruto

        setLeituraAtual({ ...dados, timestamp: timestampEmMs } as LeituraSensorTipo)
      }

      setCarregando(false)

    }, (erroFirestore) => {
      setErro(erroFirestore.message)
      setCarregando(false)
    })

    return () => pararDeEscutar()

  }, [])

  return { leituraAtual, carregando, erro }
}