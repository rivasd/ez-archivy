import { useEffect } from "react"
import useArchivyStore from "../../state/store"

interface CompteurProps {
  end: Date
  onCompteurEnd: ()=>void
}

const Compteur = ({end, onCompteurEnd}: CompteurProps) => {

  const now = useArchivyStore((state)=>state.now)

  useEffect(()=>{
    if(now > end){
      onCompteurEnd()
    }
  },[now, end, onCompteurEnd])

  return (
    <>{now < end ? <div>
      Alarme dans {Math.floor((end.getTime() - now.getTime()) / 1000) } secondes
    </div>: null}</>
  )
}

export default Compteur