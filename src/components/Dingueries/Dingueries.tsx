import { Modal } from "react-bootstrap";
import NotARobot from "../NotARobot/NotARobot"
import { useState } from "react";

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

  return (
    <Modal show={shouldShow} onExit={() => {
      setShouldShow(false)
      props.onAlarm()
    }}>
      <Modal.Header closeButton closeVariant='white'>
        <Modal.Title>Prouvez votre valeur pour continuer</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Component {...props}></Component>
      </Modal.Body>
      <Modal.Footer>
        Ne fermez pas cette fenêtre sous peine d'alarme!
      </Modal.Footer>
    </Modal>
  )
}

export default Dingueries