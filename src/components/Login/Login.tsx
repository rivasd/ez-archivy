import { Button, Container, Form } from 'react-bootstrap'
import './Login.css'
import useArchivyStore, { useLastCorruptionTime } from '../../state/store'
import { FormEvent, useCallback, useState } from 'react'
import Dingueries from '../Dingueries/Dingueries'

interface LoginProps {
  onAlarm: () => void
  onAccess: (id: string) => void
  startCountdown: ()=> void
  stopCountdown: ()=> void
  setOups: (s:string)=>void
}

const Login = ({ onAlarm, onAccess, startCountdown, stopCountdown, setOups }: LoginProps) => {

  const traitres = useArchivyStore((state => state.traitres))
  const loginCooldown = useArchivyStore((state) => state.LoginCooldownMinutes)
  const lastCompletedCorruption = useLastCorruptionTime()
  const isActive = useArchivyStore((state) => state.active)
  const now = useArchivyStore((state)=>state.now)
  const attempt = useArchivyStore((state) => state.attemptCorruption)


  const [traitreName, setTraitreName] = useState('')
  const [loginStep, setLoginStep] = useState<undefined | number>()

  const onCooldown = lastCompletedCorruption ? now < new Date(lastCompletedCorruption.getTime() + loginCooldown * 60000) : false

  const startLogin = () => {
    attempt()
    startCountdown()
  }

  const onSuccess = useCallback((name: string)=>{
    setTraitreName('')
    setLoginStep(undefined)
    onAccess(name)
  }, [onAccess])

  const checkAccess = (evt: FormEvent) => {
    evt.stopPropagation();
    evt.preventDefault();
    /*@ts-expect-error ts-ignore*/
    const uname = evt.currentTarget.elements['archive-username'].value
    /*@ts-expect-error ts-ignore*/
    const pass = evt.currentTarget.elements['archive-mdp'].value
    /*@ts-expect-error ts-ignore*/
    evt.currentTarget.elements['archive-username'].value = ''
    /*@ts-expect-error ts-ignore*/
    evt.currentTarget.elements['archive-mdp'].value = ''
    const hit = traitres.find((traitre) => traitre.username == uname && traitre.password == pass)

    if (hit) {
      if (hit.trahisonTime) {
        //has already succeeded before... punish?
        setOups("Corruption déjà effectuée! désolé")
        onAlarm()
      }
      else {
        setLoginStep(0)
        setTraitreName(uname)
      }
    } else {
      setOups('Erreur de login')
      onAlarm()
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
            ((loginStep !== undefined) && traitreName !== '') ? <Dingueries {...{
              pos: loginStep,
              onAlarm: onAlarm,
              onSuccess: onSuccess,
              traitreName: traitreName,
            }} /> : null
          }
        </div>
        <div>
          {onCooldown &&
            <div>
              Corruption éffectuée depuis moins de {loginCooldown} minutes, revenez plus tard
            </div>
          }
          
        </div>
      </Form>
    </Container>
  )
}

export default Login