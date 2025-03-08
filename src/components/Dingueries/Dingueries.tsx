import { Modal } from "react-bootstrap";
import NotARobot from "../NotARobot/NotARobot"

const orderDingueries = [
  NotARobot
]

export interface DingueriesProps {
  pos: number;
  onSuccess: (traitre: string) => void;
  onAlarm: () => void
}

const Dingueries = (props: DingueriesProps) => {

  const Component = orderDingueries[props.pos]

  return (
    <Modal>
      <Component {...props}></Component>
    </Modal>
  )
}

export default Dingueries