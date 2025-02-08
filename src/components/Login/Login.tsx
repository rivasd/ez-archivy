import { Button, Container, Form, Toast } from 'react-bootstrap'
import './Login.css'
import useArchivyStore from '../../state/store'
import { FormEvent, useCallback, useRef, useState } from 'react'

interface LoginProps {
  onAlarm: ()=>void
  onAccess: (id:string)=>void
}

const Login = ({onAlarm, onAccess}: LoginProps) => {

  const traitres = useArchivyStore((state => state.traitres))
  const loginCooldown = useArchivyStore((state)=>state.LoginCooldownMinutes)
  const attempt = useArchivyStore((state)=>state.attemptCorruption)
  const corruptionTimeLimit = useArchivyStore((state)=>state.corruptionTimeLimitSeconds)
  const lastCorruptionAttempt = useArchivyStore((state)=>state.lastCorruptionAttempt)
  
  const [timeRemaining, setTimeRemaining] = useState<number>(0)
  const [oups, setOups] = useState(false)

  const timer = useRef<ReturnType<typeof setInterval>>()

  const disabled = lastCorruptionAttempt ? (Date.now() - lastCorruptionAttempt.getTime()) > loginCooldown*60000 : false

  const stopCountdown = ()=>{
    clearInterval(timer.current)
    setTimeRemaining(0)
  }

  const getCountdownFn = useCallback(()=>{
    const countdownEndTime = Date.now() + corruptionTimeLimit*1000
    return () => {
      const remaining = (countdownEndTime - Date.now()) / 1000
      if(remaining < 0){
        stopCountdown()
        onAlarm()
      }
      else{
        setTimeRemaining(Math.ceil(remaining))
      }
    }
  },[corruptionTimeLimit, onAlarm])



  const startLogin = ()=>{
    if(timeRemaining>0 || disabled){
      //already counting down or on cooldown
      return
    }
    attempt()
    const countdownFn = getCountdownFn()
    countdownFn()
    timer.current = setInterval(countdownFn, 1000)
  }

  const checkAccess = (evt: FormEvent) => {
    evt.stopPropagation();
    evt.preventDefault();
    const uname = evt.currentTarget.elements['archive-username'].value
    const pass = evt.currentTarget.elements['archive-mdp'].value
    const hit = traitres.find((traitre)=>traitre.username==uname && traitre.password==pass)

    if(hit){
      // do more trollage
      stopCountdown()
      onAccess(uname)
    }else{
      setOups(true)
    }
  }

	return (
		<Container className='mt-5 d-flex justify-content-center'>
			<Form onSubmit={checkAccess} className='login'>
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
			
        <div>
          {timeRemaining > 0 && 
          <div>
            Alarme dans {timeRemaining} secondes
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
        </div>
      </Form>
		</Container>
	)
}

export default Login