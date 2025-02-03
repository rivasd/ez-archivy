import { Row, Col, Container } from 'react-bootstrap'
import Login from './components/Login/Login'
import Status from './components/Status/Status'
import './App.css'
import { useEffect } from 'react'
import { ArchivyState } from './state/models'
import useArchivyStore from './state/store'

function App() {

  const setwholeState = useArchivyStore((state) => state.setWholeState)

  const alarm = () => {
    alert("alarm!!!")
  }

  useEffect(() => {
    (async () => {
      if (window.ipcRenderer) {
        const storeState = await window.ipcRenderer.invoke('load-state')
        if (storeState) {
          setwholeState(storeState)
        }
      }
    })()
  }, [])

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
          <Col>
            <Container>
              <Status></Status>
              <Login onAlarm={alarm} onAccess={() => { }}></Login>
            </Container>
          </Col>
          <Col id='right-pad'></Col>
        </Row>
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
