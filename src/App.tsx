import { Row, Col, Container, Toast } from 'react-bootstrap'
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
import republic_logo from './assets/Galactic_Republic.svg'
import SVG from 'react-inlinesvg';
import RepublicLogo from './components/RepublicLogo/RepublicLogo'

const alarmPeriod = 590

function App() {

  const setwholeState = useArchivyStore((state) => state.setWholeState)
  const setTrahison = useArchivyStore((state) => state.setTrahison)
  const stepTime = useArchivyStore((state)=> state.timeStep)
  const attempt = useArchivyStore((state) => state.attemptCorruption)
  const timeLimit = useArchivyStore((state)=>state.corruptionTimeLimitSeconds)
  const alarmDuration = useArchivyStore((state) => state.alarmLengthSeconds)
  const [config, setConfig] = useState(false)
  const [logoColor, setLogoColor] = useState('rgb(76, 164, 247)')
  const [countdownEnd, setCountdownEnd] = useState<Date | undefined>()
  const [oups, setOups] = useState('')
  const alarmAudio = useRef(new Audio(alarmSound))
  const alarmInterval = useRef<ReturnType<typeof setInterval>>()
  const ticker = useRef<ReturnType<typeof setInterval>>()
  

  const handleClose = useCallback(() => setConfig(false), [])

  const swithcFn = useCallback(() => {
    let phase = true
    return () => {
      if (phase) {
        document.documentElement.classList.add('alarm')
        setLogoColor('#f32618')
      } else {
        document.documentElement.classList.remove('alarm')
        setLogoColor('rgb(76, 164, 247)')
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
    stopCountdown()
    alarmAudio.current.pause()
    alarmAudio.current.currentTime = 0
    clearInterval(alarmInterval.current)
    document.documentElement.classList.remove('alarm')
    setLogoColor('rgb(76, 164, 247)')
    
  }

  const onAuth = (uname: string) => {
    stopCountdown()
    stopAlarm()
    onGreatSuccess(uname)
  }

  const onGreatSuccess = (uname: string) => {
    attempt()
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

  const sendError = (mess: string)=>{
    setOups(mess)
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
        <Row className='me-0 h-50'>
          <Col id='left-pad' className='align-items-center justify-content-center d-flex'>
            <RepublicLogo width={200} height={200} color={logoColor}/>
          </Col>
          <Col xs={6}>
            <Container>
              <Status></Status>
              <Login onAlarm={alarm} onAccess={onAuth} startCountdown={startCountdown} stopCountdown={stopCountdown} setOups={sendError}/>
              {countdownEnd && <Compteur end={countdownEnd} onCompteurEnd={alarm}/>}
            </Container>
          </Col>
          <Col id='right-pad' className='align-items-center justify-content-center d-flex'>
            <RepublicLogo width={200} height={200} color={logoColor}/>
          </Col>
        </Row>

        <ConfigPanel
          show={config}
          onHide={handleClose}
        />

      </main>
      <footer>
      {
        oups &&
            <Toast onClose={() => setOups('')} show={
              Boolean(oups)
              } 
              delay={6000}
              autohide
              className='fixed-bottom mx-auto'
              >
              <Toast.Header closeVariant='white'>
                <strong className="me-auto">Ipelaille!</strong>
                <small>t'as raté XD</small>
              </Toast.Header>
              <Toast.Body>{
                <p  className='mx-auto text-center'>
                {oups}
              </p>
              }</Toast.Body>
            </Toast>
          }
        <Container id='footer-contents'>
          <span>© AKELA XV PRODUCTIONS</span>
        </Container>
      </footer>
    </>
  )
}

export default App
