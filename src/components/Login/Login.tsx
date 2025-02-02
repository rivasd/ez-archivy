import { Button, Container,  Row, Form } from 'react-bootstrap'
import './Login.css'
import useArchivyStore from '../../state/store'
import { FormEvent } from 'react'

interface LoginProps {
  onAlarm: ()=>void
  onAccess: ()=>void
}

const Login = ({onAlarm}: LoginProps) => {

  const traitres = useArchivyStore((state => state.traitres))

  const checkAcess = (evt: FormEvent) => {
    evt.stopPropagation();
    evt.preventDefault();
    const form = evt.currentTarget;
  }

	return (
		<Container className='mt-5'>
			<Form onSubmit={checkAcess}>
				<Form.Group controlId='archive-username' className='mb-3'>
          <Form.Label>Identifiant</Form.Label>
          <Form.Control type='input' size='sm'/>
				</Form.Group>
        <Form.Group controlId='archive-mdp'>
          <Form.Label>Mot de passe</Form.Label>
          <Form.Control type='password' size='sm'/>
				</Form.Group>
        <div className='d-flex mt-3 justify-content-center login-controls'>
          <Button variant='outline-primary' onClick={onAlarm}>Alerter</Button>
          <Button
          variant='outline-secondary'
          size='sm'
          type='submit'
          >
            accèder
          </Button>
        </div>
			</Form>
		</Container>
	)
}

export default Login