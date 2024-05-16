import classnames from 'classnames'
import Avatar from '@components/avatar'
import {TrendingUp, User, Box, DollarSign, CheckSquare, XSquare} from 'react-feather'
import { Card, CardHeader, CardTitle, CardBody, CardText, Row, Col, Media } from 'reactstrap'

import {trans} from '@utils'
import StatsVertical from '@components/widgets/stats/StatsVertical'

const ProjectStatistics = ({ cols = { sm: '4', xs: '6' }, projectData }) => {

	const data = [
		{
			title: _.size(projectData.tasks),
			subtitle: trans('user.totalTasks'),
			// color: 'light-secondary',
			color: 'secondary',
			icon: <CheckSquare size={24} />
		},
		{
			title: _.size(_.filter(projectData.tasks, x => x.status_id === 3)),
			subtitle: trans('user.onGoingTasks'),
			// color: 'light-info',
			color: 'info',
			icon: <CheckSquare size={24} />
		},
		{
			title: _.size(_.filter(projectData.tasks, x => x.status_id === 5)),
			subtitle: trans('user.failedTasks'),
			// color: 'light-danger',
			color: 'danger',
			icon: <XSquare size={24} />
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
					<Media>
						<Avatar color={item.color} icon={item.icon} className='mr-2' />
						<Media className='my-auto' body>
							<h4 className='font-weight-bolder mb-0'>{item.title}</h4>
							<CardText className='font-small-3 mb-0'>{item.subtitle}</CardText>
						</Media>
					</Media>
				</Col>
			)
		})
	}

	const renderData2 = () => {
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
			<CardHeader>
				<CardTitle tag='h4'>{trans('user.tasksOverview')}</CardTitle>
				{/*<CardText className='card-text font-small-2 mr-25 mb-0'>Updated 1 month ago</CardText>*/}
			</CardHeader>
			<CardBody className='statistics-body'>
				<Row>{renderData2()}</Row>
			</CardBody>
		</Card>
	)
}

export default ProjectStatistics
