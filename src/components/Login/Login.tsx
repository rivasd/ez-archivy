import { Button, Container, Form, Toast } from 'react-bootstrap'
import './Login.css'
import useArchivyStore, { useLastCorruptionTime } from '../../state/store'
import { FormEvent, useState } from 'react'
import Dingueries from '../Dingueries/Dingueries'

interface LoginProps {
  onAlarm: () => void
  onAccess: (id: string) => void
  startCountdown: ()=> void
  stopCountdown: ()=> void
}

const Login = ({ onAlarm, onAccess, startCountdown, stopCountdown }: LoginProps) => {

  const traitres = useArchivyStore((state => state.traitres))
  const loginCooldown = useArchivyStore((state) => state.LoginCooldownMinutes)
  const lastCompletedCorruption = useLastCorruptionTime()
  const isActive = useArchivyStore((state) => state.active)
  const attempt = useArchivyStore((state) => state.attemptCorruption)

  const [oups, setOups] = useState('')
  const [traitreName, setTraitreName] = useState('')
  const [loginStep, setLoginStep] = useState<undefined | number>()

  const onCooldown = lastCompletedCorruption ? Date.now() < (lastCompletedCorruption.getTime() + loginCooldown * 60000) : false

  const startLogin = () => {
    attempt()
    startCountdown()
  }

  const checkAccess = (evt: FormEvent) => {
    evt.stopPropagation();
    evt.preventDefault();
    const uname = evt.currentTarget.elements['archive-username'].value
    const pass = evt.currentTarget.elements['archive-mdp'].value
    evt.currentTarget.elements['archive-username'].value = ''
    evt.currentTarget.elements['archive-mdp'].value = ''
    const hit = traitres.find((traitre) => traitre.username == uname && traitre.password == pass)

    if (hit) {
      // do more trollage
      //stopCountdown()
      if (hit.trahisonTime) {
        //has already succeeded before... punish?
        setOups("Corruption déjà effectuée! désolé")
        onAlarm()
      }
      else {
        //onAccess(uname)
        setLoginStep(0)
        setTraitreName(uname)
      }
    } else {
      setOups('Erreur de login')
    }
  }

  const onDumbClick = () => {
    attempt()
    onAlarm()
    stopCountdown()
  }

  return (
    <Container className='mt-5 d-flex justify-content-center'>
      <Form onSubmit={checkAccess} className='login'>
        <Form.Group controlId='archive-username' className='mb-3'>
          <Form.Label>Identifiant</Form.Label>
          <Form.Control type='input' size='sm' onClick={startLogin} disabled={onCooldown || !isActive} />
        </Form.Group>
        <Form.Group controlId='archive-mdp'>
          <Form.Label>Mot de passe</Form.Label>
          <Form.Control type='password' size='sm' onClick={startLogin} disabled={onCooldown || !isActive} />
        </Form.Group>
        <div className='d-flex mt-3 justify-content-center login-controls'>
          <Button variant='outline-primary' onClick={onDumbClick} disabled={onCooldown || !isActive}>Alerter</Button>
          <Button
            variant='outline-secondary'
            size='sm'
            type='submit'
            disabled={onCooldown || !isActive}
          >
            accèder
          </Button>
          {
            // Démarrer les dingueries après le login initial
            loginStep !== undefined && traitreName ? <Dingueries {...{
              pos: loginStep,
              onAlarm: onAlarm,
              onSuccess: onAccess,
              traitreName: traitreName
            }} /> : null
          }
        </div>
        <div>
          {onCooldown &&
            <div>
              Corruption récente, patientez
            </div>
          }
          {
            oups && //TODO: style this toast
            <Toast onClose={() => setOups('')} show={Boolean(oups)} delay={3000} autohide>
              <Toast.Header>
                <strong className="me-auto">Ipelaille!</strong>
                <small>erreur</small>
              </Toast.Header>
              <Toast.Body>{oups}</Toast.Body>
            </Toast>
          }
        </div>
      </Form>
    </Container>
  )
}

export default Login