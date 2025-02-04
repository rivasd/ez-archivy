import { useEffect, useState } from "react"
import { ProgressBar, Row, Col } from "react-bootstrap"
import useArchivyStore from "../../state/store"
import './Status.css'

const Status = () => {

  const startDate = useArchivyStore((state)=>state.startDate)
  const endDate = useArchivyStore((state)=>state.endDate)
  const maxTraitres = useArchivyStore((state)=>state.maxFailures)
  const traitres = useArchivyStore((state)=>state.traitres)
  const [currTime, setCurrTime] = useState<Date>(new Date)
  
  // costly compute, move outside rendering loop
  const trahisons = traitres ? traitres.filter((traitre)=>traitre.trahisonTime).sort((a, b)=> a.trahisonTime!.getTime() + b.trahisonTime!.getTime()) : []
  const progressPercent = (currTime.getTime() - startDate.getTime()) / (endDate.getTime() - startDate.getTime()) * 100

  useEffect(()=>{
    const interval = setInterval(()=>setCurrTime(new Date()), 1000)
    return ()=>clearInterval(interval)
  }, [])

  return (
    <>
      <div>

        <div>Progression</div>
        <ProgressBar
        now={progressPercent}
        label={`${progressPercent.toFixed(1)} %`}
        id="archive-progress"
        />
      </div>
      <Row className="mt-2">
        <Col>
          <div>Corruptions: </div>
          <div className="counter">{`${trahisons.length} / ${maxTraitres}`}</div>
        </Col>
        <Col>
          <div>Dernière Corruption</div>
          <div>{`${(trahisons && trahisons[0] &&trahisons[0].trahisonTime) ? Date.now() - trahisons[0].trahisonTime.getTime(): '-'}`}</div>
        </Col>
      </Row>
    </>
  )
}

export default Status