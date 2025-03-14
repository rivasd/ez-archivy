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
    <>
    {
      now < end ? 
      <div className="w-50 mx-auto mt-3">
        Pour votre sécurité, complétez le processus avant {Math.floor((end.getTime() - now.getTime()) / 1000) } secondes.
      </div>
      : 
      null
    }
    </>
  )
}

export default Compteur