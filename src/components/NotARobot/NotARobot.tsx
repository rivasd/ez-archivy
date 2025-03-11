import FaCaptcha from "facaptcha";
import { Container, Modal } from "react-bootstrap"
import { DingueriesProps } from "../Dingueries/Dingueries";
import img1 from '../../assets/dadalapin/image1x1.jpeg'


const NotARobot = (props: DingueriesProps) => {

	const images = import.meta.glob(import.meta.env.BASE_URL + './dadalapin/*.jpeg', { eager: true, as: 'url' }) as Object
	const imagesTypes = Object.entries(images).map(([key, val]) => ({
		url: val,
		topics: ["douille"]
	}))

	return (
		<Container >
			<FaCaptcha
				captchaTopics={['douille']}
				onVerificationComplete={() => props.onSuccess(props.traitreName)}
				imgTopicUrls={imagesTypes}
				cellsWide={3}
				allowRetry
			/>
		</Container>
	)
}

export default NotARobot