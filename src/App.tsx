import { Row, Col, Container} from 'react-bootstrap'
import Login from './components/Login/Login'
import Status from './components/Status/Status'
import './App.css'

function App() {

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
              <Login></Login>
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
