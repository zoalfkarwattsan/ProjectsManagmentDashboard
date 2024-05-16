import Avatar from '@src/components/avatar'
import { Card, CardBody, CardText, Row, Col, Media } from 'reactstrap'

import {trans} from '@utils'

const ElectionStatistics = ({ cols = { xs: '6' }, livestreamData }) => {

	const data = [
		{
			title: livestreamData.cancelled_votes,
			subtitle: trans('user.cancelled'),
			color: 'grey',
			icon: <></>
		},
		{
			title: livestreamData.white_papers,
			subtitle: trans('user.whitePapers'),
			color: 'light-white',
			icon: <></>
		}
	]

	const renderData = () => {
		return data.map((item, index) => {
			const margin = Object.keys(cols)
			return (
				<Col
					key={index}
					{...cols}
					// className={classnames({
					// 	[`mb-2 mb-${margin[0]}-0`]: index !== data.length - 1
					// })}
				>
					<Media>
						<Avatar color={item.color} icon={item.icon} className='mr-2' />
						<Media className='my-auto' body>
							<h4 className='font-weight-bolder mb-0'>{item.title}</h4>
							<CardText style={{wordWrap: 'break-word'}} className='font-small-3 mb-0'>{item.subtitle}</CardText>
						</Media>
					</Media>
				</Col>
			)
		})
	}

	return (
		<Card className='card-statistics '>
			<CardBody className='statistics-body'>
				<Row>{renderData()}</Row>
			</CardBody>
		</Card>
	)
}

export default ElectionStatistics
