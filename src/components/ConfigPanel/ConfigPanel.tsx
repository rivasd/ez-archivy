import { Modal, Form, Col, Row, Button } from 'react-bootstrap'
import { useForm, SubmitHandler } from "react-hook-form"
import './ConfigPanel.css'
import useArchivyStore from '../../state/store'
import { ArchivyState } from '../../state/models'

interface ConfigProps{
  show: boolean
  onHide: ()=>void
}


const ConfigPanel = ({show, onHide}:ConfigProps)=>{

  const wholeState = useArchivyStore((state)=>state)

  const {
    register,
    handleSubmit,
    formState: {errors}
  } = useForm<ArchivyState>({
    defaultValues: wholeState
  })
  const onSubmit: SubmitHandler<ArchivyState> = (data, evt) => {
    evt?.preventDefault()
    wholeState.setWholeState(data)
  }

  return (
    <Modal show={show} onHide={onHide} size='lg'>
      <Modal.Header closeButton>
        <Modal.Title>Configuration</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)} id='config-form'>
            <Row>
              <Col>
                <Form.Group controlId='maxFailures'>
                  <Form.Label>Nombre max. de corruptions</Form.Label>
                  <Form.Control type='number' defaultValue={wholeState.maxFailures} {...register("maxFailures")}/>
                </Form.Group>
                <Form.Group controlId='maxLoginAttemps'>
                  <Form.Label>Max. essais login</Form.Label>
                  <Form.Control type='number' defaultValue={wholeState.maxLoginAttempts} {...register("maxLoginAttempts")}/>
                </Form.Group>
                <Form.Group controlId='maxLoginCooldown'>
                  <Form.Label>Sec. avant de revenir à 0 essais</Form.Label>
                  <Form.Control type='number' defaultValue={wholeState.LoginAttemptsCooldownSeconds} {...register("LoginAttemptsCooldownSeconds")}/>
                </Form.Group>
              </Col>
              <Col>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button type='submit' form='config-form'>OK</Button>
        </Modal.Footer>
    </Modal>
  )
}

export default ConfigPanel