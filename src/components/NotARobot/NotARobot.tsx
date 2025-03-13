import FaCaptcha from "facaptcha";
import { Container } from "react-bootstrap"
import { DingueriesProps } from "../Dingueries/Dingueries";
import './NotARobot.css'
import { useMemo, memo } from "react";


const NotARobot = (props: DingueriesProps) => {

	const imagesTypes = useMemo(()=>{
		const images = import.meta.glob('../../assets/guigui/*.jpg', { eager: true, as: 'url' }) as Object
		const imgArr = Object.entries(images).map(([_, val]) => ({
			url: val,
			topics: ["Fringant jeune homme"]
		}))
		return imgArr
	}, [])
	

	return (
		<Container >
			<div className="captcha">
			<FaCaptcha
				captchaTopics={['Fringant jeune homme']}
				onVerificationComplete={() => props.onSuccess(props.traitreName)}
				imgTopicUrls={imagesTypes}
				cellsWide={3}
				headerText="Cliquez sur toutes les images comprenant un 'fringant jeune homme'."
				helpText="Ce jeune Guillaume est, ma foi, un fringant jeune homme"
				maxAttempts={1}
				notARobotText="Je nie être dénué(e) de bonnes intentions"
				verifyText="Vérifier"
				allowRetry={false}
			/>
		</div>
		</Container>
	)
}

export default memo(NotARobot)