import { Modal } from "react-bootstrap";
import NotARobot from "../NotARobot/NotARobot"
import { useState, memo } from "react";

const orderDingueries = [
  NotARobot
]

export interface DingueriesProps {
  pos: number;
  traitreName: string;
  onSuccess: (traitre: string) => void;
  onAlarm: () => void
}

const Dingueries = (props: DingueriesProps) => {

  const Component = orderDingueries[props.pos]
  const [shouldShow, setShouldShow] = useState(true)

  const succeed = (name) => {
    setShouldShow(false)
    props.onSuccess(name)
  }

  return (
    <Modal show={shouldShow} onHide={() => {
      setShouldShow(false)
      props.onAlarm()
    }}
    keyboard={false} backdrop="static" className="dingueries">
      <Modal.Header closeButton closeVariant='white'>
        <Modal.Title>Prouvez votre valeur pour continuer</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Component {... {...props, onSuccess:succeed}}></Component>
      </Modal.Body>
      <Modal.Footer>
        Ne fermez pas cette fenêtre sous peine d'alarme!
      </Modal.Footer>
    </Modal>
  )
}

export default memo(Dingueries)