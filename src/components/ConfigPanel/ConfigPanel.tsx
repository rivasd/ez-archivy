import { Modal, Form, Col, Row } from 'react-bootstrap'
import { useForm } from "react-hook-form"
import './ConfigPanel.css'
import useArchivyStore from '../../state/store'
import { toLocalISOString } from '../../utils/utils'

interface ConfigProps{
  show: boolean
  onHide: ()=>void
}


const ConfigPanel = ({show, onHide}:ConfigProps)=>{

  const wholeState = useArchivyStore((state)=>state)
  

  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      ...wholeState,
      startDate: toLocalISOString(wholeState.startDate),
      endDate: toLocalISOString(wholeState.endDate)
    }
  })

  const onSubmit = (data, evt) => {
    evt?.preventDefault()
    wholeState.setWholeState({
      ...data,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate)
    })
  }

  const save = ()=>{
    handleSubmit(onSubmit)()
    onHide()
  }

  return (
    <Modal show={show} onHide={save} size='lg'>
      <Modal.Header closeButton closeVariant='white'>
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
                  <Form.Label>Cooldown d'essais de login</Form.Label>
                  <Form.Control type='number' defaultValue={wholeState.LoginCooldownMinutes} {...register("LoginAttemptsCooldownSeconds")}/>
                </Form.Group>
                <Form.Group controlId='alarmLength'>
                  <Form.Label>Durée de l'alarme</Form.Label>
                  <Form.Control type='number' defaultValue={wholeState.alarmLengthSeconds} {...register("alarmLengthSeconds")}/>
                </Form.Group>
                <Form.Group controlId='corruptionTimeLimit'>
                  <Form.Label>Temps pour complèter une corruption</Form.Label>
                  <Form.Control type='number' defaultValue={wholeState.corruptionTimeLimitSeconds} {...register("corruptionTimeLimitSeconds")}/>
                </Form.Group>
              </Col>
                
              <Col>
                <Form.Group controlId='processStart'>
                  <Form.Label>Temps de début du compteur</Form.Label>
                  <Form.Control type='datetime-local' step='1' 
                    {...register("startDate", 
                      {
                        valueAsDate: false, 
                      })
                    }/>
                </Form.Group>
                <Form.Group controlId='processEnd'>
                  <Form.Label>Temps de complétion du compteur</Form.Label>
                  <Form.Control type='datetime-local' step='1'  
                    {...register("endDate", 
                      {
                        valueAsDate: false,
                      })
                    }/>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
    </Modal>
  )
}

export default ConfigPanel