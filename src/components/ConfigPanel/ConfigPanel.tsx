import { Button, Modal, Form, Col, Row, InputGroup } from 'react-bootstrap'
import { useFieldArray, useForm } from "react-hook-form"
import './ConfigPanel.css'
import useArchivyStore from '../../state/store'
import { toLocalISOString } from '../../utils/utils'
import { Traitre } from '../../state/models'
import { Trash } from 'react-bootstrap-icons'
import {memo} from 'react'

interface ConfigProps {
  show: boolean
  onHide: () => void
}


const ConfigPanel = ({ show, onHide }: ConfigProps) => {

  const setWholeState = useArchivyStore((state) => state.setWholeState)


  const {
    register,
    handleSubmit,
    formState: { errors },
    control
  } = useForm({
    defaultValues: {
      active: useArchivyStore((s)=>s.active),
      maxFailures: useArchivyStore((s)=>s.maxFailures),
      maxLoginAttempts: useArchivyStore((s)=>s.maxLoginAttempts),
      LoginCooldownMinutes: useArchivyStore((s)=>s.maxLoginAttempts),
      alarmLengthSeconds : useArchivyStore((s)=>s.alarmLengthSeconds),
      corruptionTimeLimitSeconds:  useArchivyStore((s)=>s.corruptionTimeLimitSeconds),
      startDate: toLocalISOString(useArchivyStore((s)=>s.startDate)),
      endDate: toLocalISOString(useArchivyStore((s)=>s.endDate)),
      traitres: useArchivyStore((s)=>s.traitres).map((traitre: Traitre) => ({
        ...traitre,
        trahisonTime: traitre.trahisonTime ? toLocalISOString(traitre.trahisonTime) : undefined
      }))
    }
  })

  const { fields, append, remove } = useFieldArray({
    name: 'traitres',
    control: control
  })

  const onSubmit = (data, evt) => {
    evt?.preventDefault()
    setWholeState({
      ...data,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      traitres: data.traitres.map((traitre: Traitre) => ({
        ...traitre,
        trahisonTime: traitre.trahisonTime ? new Date(traitre.trahisonTime) : undefined,
      now: new Date
      }))
    })
  }

  const save = () => {
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

              <Form.Check type='switch' {...register('active')} label="ACTIVATION" />

              <Form.Group controlId='maxFailures'>
                <Form.Label>Nombre de vies</Form.Label>
                <Form.Control type='number'  {...register("maxFailures")} size='sm' />
              </Form.Group>
              <Form.Group controlId='maxLoginAttemps'>
                <Form.Label>Max. essais login</Form.Label>
                <Form.Control type='number'  {...register("maxLoginAttempts")} size='sm' />
              </Form.Group>
              <Form.Group controlId='maxLoginCooldown'>
                <Form.Label>Cooldown entre corruptions (m)</Form.Label>
                <Form.Control type='number' {...register("LoginCooldownMinutes")} size='sm' />
              </Form.Group>
              <Form.Group controlId='alarmLength'>
                <Form.Label>Durée de l'alarme</Form.Label>
                <Form.Control type='number'  {...register("alarmLengthSeconds")} size='sm' />
              </Form.Group>
              <Form.Group controlId='corruptionTimeLimit'>
                <Form.Label>Temps pour complèter une corruption</Form.Label>
                <Form.Control type='number'  {...register("corruptionTimeLimitSeconds")} size='sm' />
              </Form.Group>
              <Form.Group controlId='processStart'>
                <Form.Label>Temps de début du compteur</Form.Label>
                <Form.Control type='datetime-local' step='1'
                  {...register("startDate",
                    {
                      valueAsDate: false,
                    })
                  } size='sm' />
              </Form.Group>
              <Form.Group controlId='processEnd'>
                <Form.Label>Temps de complétion du compteur</Form.Label>
                <Form.Control type='datetime-local' step='1'
                  {...register("endDate",
                    {
                      valueAsDate: false,
                    })
                  } size='sm' />
              </Form.Group>
            </Col>

            <Col>
              <div className='traitre-title'>Traîtres</div>
              <>
                {
                  fields.map((traitre, index) => (
                    <fieldset key={traitre.id} className='traitres-info mb-3 d-flex'>
                      <div>
                        <InputGroup className='rounded-top traitre-top' size='sm'>
                          <InputGroup.Text>Id: </InputGroup.Text>
                          <Form.Control type='text' defaultValue={traitre.username} {...register(`traitres.${index}.username` as const)} />
                        </InputGroup>
                        <InputGroup className='traitre-middle' size='sm'>
                          <InputGroup.Text>mdp: </InputGroup.Text>
                          <Form.Control type='text' defaultValue={traitre.password} {...register(`traitres.${index}.password` as const)} />
                        </InputGroup>
                        <InputGroup className='traitre-bot' size='sm'>
                          <InputGroup.Text>trahison: </InputGroup.Text>
                          <Form.Control type='datetime-local' step='1' {...register(`traitres.${index}.trahisonTime` as const, { valueAsDate: false })} />
                        </InputGroup>
                      </div>
                      <Button onClick={() => remove(index)} variant='outline-primary' className='btn-no-border'>
                        <Trash></Trash>
                      </Button>
                    </fieldset>
                  ))
                }
                <Button onClick={() => append({ username: 'nouveau', password: 'nouveau' })} variant='outline-primary'>+</Button>
              </>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default memo(ConfigPanel)