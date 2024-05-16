import { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import {
	Card,
	CardHeader,
	CardTitle,
	CardBody,
	CardText,
	UncontrolledDropdown,
	DropdownMenu,
	DropdownItem,
	DropdownToggle,
	Row,
	Col
} from 'reactstrap'
import Chart from 'react-apexcharts'
import _ from "lodash"

import { ThemeColors } from '@src/utility/context/ThemeColors'
import {trans, _url} from '@utils'
import {useTrans} from '@hooks/useTrans'
import '@styles/react/libs/charts/apex-charts.scss'

const ProjectTracker = ({projectData}) => {
	const context = useContext(ThemeColors)

	const options = {
			plotOptions: {
				radialBar: {
					size: 150,
					offsetY: 20,
					startAngle: -150,
					endAngle: 150,
					hollow: {
						size: '65%'
					},
					track: {
						background: '#fff',
						strokeWidth: '100%'
					},
					dataLabels: {
						name: {
							offsetY: -5,
							fontFamily: 'Montserrat',
							fontSize: '1rem'
						},
						value: {
							offsetY: 15,
							fontFamily: 'Montserrat',
							fontSize: '1.714rem'
						}
					}
				}
			},
			colors: [context.colors.danger.main],
			fill: {
				type: 'gradient',
				gradient: {
					shade: 'dark',
					type: 'horizontal',
					shadeIntensity: 0.5,
					gradientToColors: [context.colors.primary.main],
					inverseColors: true,
					opacityFrom: 1,
					opacityTo: 1,
					stops: [0, 100]
				}
			},
			stroke: {
				dashArray: 8
			},
			labels: [useTrans('user.completedTasks')]
		},
		series = [Math.floor(_.size(projectData.tasks) > 0 ? _.size(_.filter(projectData.tasks, x => x.status_id === 1)) === 0 ? 100 : (_.size(_.filter(projectData.tasks, x => x.status_id === 2)) / _.size(_.filter(projectData.tasks, x => x.status_id === 1 || x.status_id === 2))) * 100 : 0)]

	return (
		<Card>
			<CardHeader className='pb-0'>
				<CardTitle tag='h4'>{trans('user.projectTracker')}</CardTitle>
			</CardHeader>
			<CardBody>
				<Row>
					<Col sm='2' className='d-flex flex-column flex-wrap text-center'>
						<h1 className='font-large-2 font-weight-bolder mt-2 mb-0'>{_.size(projectData.tasks)}</h1>
						<CardText>{trans('user.total#OfTasks')}</CardText>
					</Col>
					<Col sm='8' className='d-flex justify-content-center'>
						<Chart options={options} series={series} type='radialBar' height={270} id='support-tracker-card' />
					</Col>
					<Col sm='2' className='d-flex flex-column flex-wrap text-center'>
						<div className='text-center'>
							<h1 className='font-large-2 font-weight-bolder mt-2 mb-0'>{_.size(_.filter(projectData.tasks, x => x.status_id === 2))}</h1>
							<CardText className='mb-50'>{trans('user.completedTasks')}</CardText>
						</div>
					</Col>
				</Row>
				<Row className='justify-content-between mt-1'>
					<Col sm='2' className='d-flex flex-column flex-wrap text-center'>
						<div className='text-center'>
							<CardText className='mb-50'>{trans('user.pendingTasks')}</CardText>
							<span className='font-large-1 font-weight-bold'>{_.size(_.filter(projectData.tasks, x => x.status_id === 1))}</span>
						</div>
					</Col>
					<Col sm='8' className='d-flex justify-content-center'>
						<div className='text-center'>
							<CardText className='mb-50'>{trans('user.onGoingTasks')}</CardText>
							<span className='font-large-1 font-weight-bold'>{_.size(_.filter(projectData.tasks, x => x.status_id === 3))}</span>
						</div>
					</Col>
					<Col sm='2' className='d-flex flex-column flex-wrap text-center'>
						<div className='text-center'>
							<CardText className='mb-50'>{trans('user.failedTasks')}</CardText>
							<span className='font-large-1 font-weight-bold'>{_.size(_.filter(projectData.tasks, x => x.status_id === 5))}</span>
						</div>
					</Col>
				</Row>
			</CardBody>
		</Card>
	)
}
export default ProjectTracker
