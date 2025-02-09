import { useEffect, useState } from "react"
import { ProgressBar, Row, Col } from "react-bootstrap"
import useArchivyStore, { useNumberOfCorruptions } from "../../state/store"
import './Status.css'

const Status = () => {

  const startDate = useArchivyStore((state)=>state.startDate)
  const endDate = useArchivyStore((state)=>state.endDate)
  const maxTraitres = useArchivyStore((state)=>state.maxFailures)
  const lastAttempt = useArchivyStore((state)=>state.lastCorruptionAttempt)
  const setDisabled = useArchivyStore((state)=>state.setDisabled)
  const [currTime, setCurrTime] = useState<Date>(new Date)
  
  // costly compute, move outside rendering loop
  const trahisons = useNumberOfCorruptions()
  const progressPercent = Math.floor((currTime.getTime() - startDate.getTime()) / (endDate.getTime() - startDate.getTime()) * 1000) / 10
  

  const getTimeSinceLastCorr = ()=>{
    if(lastAttempt){
      let delta = Date.now() - lastAttempt.getTime()
      const days = Math.floor(delta / (24*60*60*1000))
      delta -= days * 24*60*60*1000
      const hours = Math.floor(delta / (60*60*1000))
      delta -= hours*60*60*1000
      const minutes = Math.floor(delta / (60*1000))
      delta -= minutes*60*1000
      const seconds = Math.floor(delta / 1000)
      return `${days}j ${hours}h ${minutes}m ${seconds}s`
    }
    else{
      return '-'
    }
  }

  const getProgBarText = ()=>{
    if(progressPercent>=100){
      return 'COMPLET'
    }
    else if(trahisons >= maxTraitres){
      return 'CORROMPU'
    }
    else{
      return `${Math.min(progressPercent, 100).toFixed(1)} %`
    }
  }

  useEffect(()=>{
    const interval = setInterval(()=>{
      if(progressPercent >= 100){
        setDisabled()
      }
      setCurrTime(new Date())
    }, 1000)
    return ()=>clearInterval(interval)
  }, [progressPercent])

  return (
    <>
      <div>

        <div>Progression</div>
        <ProgressBar
        now={trahisons >= maxTraitres ? 100: progressPercent}
        label={getProgBarText()}
        id="archive-progress"
        className={progressPercent>=100 ? 'completed': (trahisons >= maxTraitres ? 'corrupted': '')}
        />
      </div>
      <Row className="mt-2">
        <Col>
          <div>Corruptions: </div>
          <div className="counter">{`${trahisons} / ${maxTraitres}`}</div>
        </Col>
        <Col>
          <div>Dernier essai de corruption</div>
          <div>{getTimeSinceLastCorr()}</div>
        </Col>
      </Row>
    </>
  )
}

export default Status