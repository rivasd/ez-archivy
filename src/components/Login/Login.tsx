import { Button, Container,  Row, Form, Toast } from 'react-bootstrap'
import './Login.css'
import useArchivyStore from '../../state/store'
import { FormEvent, useEffect, useRef, useState } from 'react'

interface LoginProps {
  onAlarm: ()=>void
  onAccess: ()=>void
}

const Login = ({onAlarm}: LoginProps) => {

  const traitres = useArchivyStore((state => state.traitres))
  const loginCooldown = useArchivyStore((state)=>state.LoginCooldownMinutes)
  const attempt = useArchivyStore((state)=>state.attemptCorruption)
  const corruptionTimeLimit = useArchivyStore((state)=>state.corruptionTimeLimitSeconds)
  
  const [attemptStart, setAttemptStart] = useState<Date|undefined>()
  const [countdown, setCountDown] = useState(corruptionTimeLimit)
  const [oups, setOups] = useState(false)

  const timer = useRef<ReturnType<typeof setInterval>>()

  const disabled = attemptStart ? (new Date().getTime() - attemptStart.getTime()) > loginCooldown*60000 : false
  const inProgress = attemptStart && Date.now() > attemptStart.getTime() && Date.now() < (attemptStart.getTime()+corruptionTimeLimit*1000)
  
  const startLogin = ()=>{
    if(!attemptStart || ((Date.now() - attemptStart.getTime()) > corruptionTimeLimit*1000)){
      attempt()
      setAttemptStart(new Date())
    }
  }

  useEffect(()=>{
    if(!attemptStart){
      return
    }
    timer.current = setInterval(()=>{
      const remaining = (corruptionTimeLimit*1000 - (Date.now() - attemptStart!.getTime())) / 1000
      if(remaining < 0 || !attemptStart){
        clearInterval(timer.current)
        setAttemptStart(undefined)
        setCountDown(corruptionTimeLimit)
        onAlarm()
      }
      else{
        setCountDown(Math.ceil(remaining))
      }
    }, 1000)

    return ()=>clearInterval(timer.current)
  },[attemptStart])

  const checkAcess = (evt: FormEvent) => {
    evt.stopPropagation();
    evt.preventDefault();
    const uname = evt.currentTarget.elements['archive-username'].value
    const pass = evt.currentTarget.elements['archive-mdp'].value
    const hit = traitres.find((traitre)=>traitre.username==uname && traitre.password==pass)

    if(hit){
      // do more trollage
      setAttemptStart(undefined)
    }else{
      setOups(true)
    }
  }

	return (
		<Container className='mt-5'>
			<Form onSubmit={checkAcess}>
				<Form.Group controlId='archive-username' className='mb-3'>
          <Form.Label>Identifiant</Form.Label>
          <Form.Control type='input' size='sm' onClick={startLogin}/>
				</Form.Group>
        <Form.Group controlId='archive-mdp'>
          <Form.Label>Mot de passe</Form.Label>
          <Form.Control type='password' size='sm' onClick={startLogin}/>
				</Form.Group>
        <div className='d-flex mt-3 justify-content-center login-controls'>
          <Button variant='outline-primary' onClick={onAlarm}>Alerter</Button>
          <Button
          variant='outline-secondary'
          size='sm'
          type='submit'
          disabled={disabled}
          >
            accèder
          </Button>
        </div>
			</Form>
      <Row>
        {inProgress && 
        <div>
          Alarme dans {countdown} secondes
        </div>
        }
        {
          oups &&
          <Toast onClose={()=>setOups(false)} show={oups} delay={3000} autohide>
            <Toast.Header>
              <strong className="me-auto">Ipelaille!</strong>
              <small>erreur</small>
            </Toast.Header>
            <Toast.Body>identification invalide</Toast.Body>
          </Toast>
        }
      </Row>
		</Container>
	)
}

export default Login