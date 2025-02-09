import { Row, Col, Container } from 'react-bootstrap'
import Login from './components/Login/Login'
import Status from './components/Status/Status'
import ConfigPanel from './components/ConfigPanel/ConfigPanel'
import './App.css'
import useArchivyStore from './state/store'
import { useEffect, useState, useRef, useCallback } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { initialState } from './state/store'
import alarmSound from './assets/battle-alarm.mp3'

const alarmPeriod = 590

function App() {

  const setwholeState = useArchivyStore((state) => state.setWholeState)
  const setTrahison = useArchivyStore((state)=>state.setTrahison)
  const alarmDuration = useArchivyStore((state)=>state.alarmLengthSeconds)
  const [config, setConfig] = useState(false)
  const alarmAudio = useRef(new Audio(alarmSound))
  const alarmInterval = useRef<ReturnType<typeof setInterval>>()

  const handleClose = ()=>setConfig(false)

  const swithcFn = useCallback(()=>{
    let phase = true
    return ()=>{
      if(phase){
        document.documentElement.classList.add('alarm')
      }else{
        document.documentElement.classList.remove('alarm')
      }
      phase = !phase
    }
  },[])

  const alarm = () => {
    //return
    alarmAudio.current.loop = true
    alarmAudio.current.play()
    const endTime = Date.now() + alarmDuration*1000
    const switchingFn = swithcFn()

    switchingFn()
    alarmInterval.current = setInterval(()=>{
      if(Date.now() < endTime){
        switchingFn()
      }
      else{
        stopAlarm()
      }
    }, alarmPeriod)
  }

  const stopAlarm = ()=> {
    alarmAudio.current.pause()
    alarmAudio.current.currentTime = 0
    clearInterval(alarmInterval.current)
    document.documentElement.classList.remove('alarm')
  }

  const onAuth = (uname:string)=>{

    onGreatSuccess(uname)
  }

  const onGreatSuccess = (uname:string)=>{

    
    setTrahison(uname)
  }

  useEffect(()=>{
    if(!localStorage.getItem('archivy-state')){
      setwholeState(initialState)
    }
  }, [setwholeState])

  useHotkeys('ctrl+3+4', ()=>{
    stopAlarm()
    setConfig(true)
  })


  return (
    <>
      <header>
        <Container id='header-contents'>
          <h3 id='random-text' className='aurek'>Darthaniel est trop fort</h3>
          <p id='main-title'>EZ-Archivy</p>
          <p id='tagline'>Le système de mise à jour d'archives FACILE à utiliser!</p>
        </Container>
      </header>
      <main id='main' className='flex-grow-1 pt-3'>
        <Row className='me-0'>
          <Col id='left-pad'></Col>
          <Col xs={6}>
            <Container>
              <Status></Status>
              <Login onAlarm={alarm} onAccess={onAuth}></Login>
            </Container>
          </Col>
          <Col id='right-pad'></Col>
        </Row>

        <ConfigPanel
        show={config}
        onHide={handleClose}
        />
      </main>
      <footer>
        <Container id='footer-contents'>
          <span>© AKELA XV PRODUCTIONS</span>
        </Container>
      </footer>
    </>
  )
}

export default App
