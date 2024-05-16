import classnames from 'classnames'
import Avatar from '@components/avatar'
import {TrendingUp, User, Box, DollarSign, CheckSquare, XSquare} from 'react-feather'
import { Card, CardHeader, CardTitle, CardBody, CardText, Row, Col, Media } from 'reactstrap'

import {trans} from '@utils'
import StatsVertical from '@components/widgets/stats/StatsVertical'

const ElectionStatistics = ({ cols = { sm: '4', xs: '6' }, livestreamData }) => {

	const data = [
		{
			title: livestreamData.voted_white,
			subtitle: trans('user.white'),
			// color: 'light-secondary',
			color: 'white',
			icon: <></>
		},
		{
			title: livestreamData.voted_grey,
			subtitle: trans('user.grey'),
			// color: 'light-info',
			color: 'grey',
			icon: <></>
		},
		{
			title: livestreamData.voted_black,
			subtitle: trans('user.black'),
			// color: 'light-danger',
			color: 'black',
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
					className={classnames({
						[`mb-2 mb-${margin[0]}-0`]: index !== data.length - 1
					})}
				>
						<StatsVertical icon={item.icon} color={item.color} stats={`${item.title}`} statTitle={item.subtitle} />
				</Col>
			)
		})
	}

	return (
		<Card className='card-statistics'>
			<CardBody className='statistics-body'>
				<Row>{renderData()}</Row>
			</CardBody>
		</Card>
	)
}

export default ElectionStatistics
