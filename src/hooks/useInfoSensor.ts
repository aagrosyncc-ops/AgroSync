import { useEffect, useState } from 'react'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { firestore } from '@/servicos/Firebase'
import { InfoSensorTipo } from '@/tipos/InfoSensor'

// como so temos um sensor por enquanto, usamos sempre o mesmo id de documento
const ID_DO_SENSOR = 'sensor_principal'

export function useInfoSensor() {

  const [infoSensor, setInfoSensor] = useState<InfoSensorTipo>({
    nome: 'Sensor NPK',
    local: 'Local não definido',
  })
  const [carregando, setCarregando] = useState(true)

  // fica escutando o documento, igual o usedadosSensor escuta a coleção
  useEffect(() => {
    const referencia = doc(firestore, 'config_sensor', ID_DO_SENSOR)

    const pararDeEscutar = onSnapshot(referencia, (snapshot) => {
      if (snapshot.exists()) {
        setInfoSensor(snapshot.data() as InfoSensorTipo)
      }
      setCarregando(false)
    })

    return () => pararDeEscutar()
  }, [])

  // salva um nomenovo no firestore
  const salvarInfoSensor = async (novaInfo: InfoSensorTipo) => {
    const referencia = doc(firestore, 'config_sensor', ID_DO_SENSOR)
    await setDoc(referencia, novaInfo, { merge: true })
  }

  return { infoSensor, carregando, salvarInfoSensor }
}