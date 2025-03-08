import FaCaptcha from "facaptcha";
import { Container, Modal } from "react-bootstrap"
import { DingueriesProps } from "../Dingueries/Dingueries";


const NotARobot = (props: DingueriesProps) => {

	return (
		<Container >
			<FaCaptcha
				onVerificationComplete={() => alert('yay!')}
				imgTopicUrls={demo1}
				cellsWide={3}
				allowRetry
			/>
		</Container>
	)
}

export default NotARobot