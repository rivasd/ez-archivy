import { Row, Col, Container } from 'react-bootstrap'
import Login from './components/Login/Login'
import Status from './components/Status/Status'
import ConfigPanel from './components/ConfigPanel/ConfigPanel'
import './App.css'
import useArchivyStore from './state/store'
import { useEffect, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { initialState } from './state/store'


function App() {

  const setwholeState = useArchivyStore((state) => state.setWholeState)
  const [config, setConfig] = useState(false)

  const handleClose = ()=>setConfig(false)

  const alarm = () => {
    alert("alarm!!!")
  }

  useEffect(()=>{
    if(!localStorage.getItem('archivy-state')){
      setwholeState(initialState)
    }
  }, [setwholeState])

  useHotkeys('ctrl+3+4', ()=>setConfig(true))

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
              <Login onAlarm={alarm} onAccess={() => { }}></Login>
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
