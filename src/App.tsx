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
import Compteur from './components/Compteur/Compteur'

const alarmPeriod = 590

function App() {

  const setwholeState = useArchivyStore((state) => state.setWholeState)
  const setTrahison = useArchivyStore((state) => state.setTrahison)
  const stepTime = useArchivyStore((state)=> state.timeStep)
  const timeLimit = useArchivyStore((state)=>state.corruptionTimeLimitSeconds)
  const alarmDuration = useArchivyStore((state) => state.alarmLengthSeconds)
  const [config, setConfig] = useState(false)
  const [countdownEnd, setCountdownEnd] = useState<Date | undefined>()
  const [alarmEnd, setAlarmEnd] = useState<Date | undefined>()
  const alarmAudio = useRef(new Audio(alarmSound))
  const alarmInterval = useRef<ReturnType<typeof setInterval>>()
  const ticker = useRef<ReturnType<typeof setInterval>>()

  const handleClose = useCallback(() => setConfig(false), [])

  const swithcFn = useCallback(() => {
    let phase = true
    return () => {
      if (phase) {
        document.documentElement.classList.add('alarm')
      } else {
        document.documentElement.classList.remove('alarm')
      }
      phase = !phase
    }
  }, [])

  //start a global ticking clock for the whole app
  useEffect(()=>{
    ticker.current = setInterval(()=>{
      stepTime()
    }, 1000)  // 1s resolution
    return () => clearInterval(ticker.current)
  }, [stepTime])

  const alarm = () => {
    //return
    stopCountdown()
    const endTime = new Date(Date.now() + (alarmDuration * 1000))
    alarmAudio.current.loop = true
    alarmAudio.current.play()
    const switchingFn = swithcFn()

    switchingFn()
    alarmInterval.current = setInterval(() => {
      if (new Date() < endTime) {
        switchingFn()
      }
      else {
        stopAlarm()
      }
    }, alarmPeriod)
  }

  const stopAlarm = () => {
    alarmAudio.current.pause()
    alarmAudio.current.currentTime = 0
    clearInterval(alarmInterval.current)
    document.documentElement.classList.remove('alarm')
    setAlarmEnd(undefined)
  }

  const onAuth = (uname: string) => {
    stopCountdown()
    stopAlarm()
    onGreatSuccess(uname)
  }

  const onGreatSuccess = (uname: string) => {
    setTrahison(uname)
  }

  const startCountdown = ()=>{
    if(!countdownEnd || countdownEnd < new Date()){
      setCountdownEnd(new Date(Date.now() + timeLimit*1000))
    }
  }

  const stopCountdown = ()=>{
    setCountdownEnd(undefined)
  }

  useEffect(() => {
    if (!localStorage.getItem('archivy-state')) {
      setwholeState(initialState)
    }
  }, [setwholeState])

  useHotkeys('ctrl+3+4', () => {
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
              <Login onAlarm={alarm} onAccess={onAuth} startCountdown={startCountdown} stopCountdown={stopCountdown}/>
              {countdownEnd && <Compteur end={countdownEnd} onCompteurEnd={alarm}/>}
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
