import React, {Fragment, useContext} from 'react'
import PropTypes from 'prop-types'
import {Card, CardBody, CardHeader, CardText, CardTitle, Col, Row, Label, FormGroup} from "reactstrap"
import {Briefcase, CheckSquare} from "react-feather"
import Chart from "react-apexcharts"

import StatsVertical from '@components/widgets/stats/StatsVertical'
import {trans} from '@utils'
import {useTrans} from '@hooks/useTrans'

const ProfileDataTab = ({data}) => {

	return (
		<Fragment>
			<Row>
				<Col sm='3' xs='6'>
					<StatsVertical icon={<Briefcase size={21} />} color='secondary' stats={`${data.projects.length}`} statTitle={useTrans('user.profile.projects')} />
				</Col>
				<Col sm='3' xs='6'>
					<StatsVertical icon={<CheckSquare size={21} />} color='secondary' stats={`${data.tasks.length}`} statTitle={useTrans('user.profile.tasks')} />
				</Col>
				<Col sm='3' xs='6'>
					<StatsVertical icon={<CheckSquare size={21} />} color='success' stats={`${data.tasks.filter(x => x.status_id === 2).length}`} statTitle={useTrans('user.profile.completedTasks')} />
				</Col>
				<Col sm='3' xs='6'>
					<StatsVertical icon={<CheckSquare size={21} />} color='warning' stats={`${data.tasks.filter(x => x.status_id === 1).length}`} statTitle={useTrans('user.profile.pendingTasks')} />
				</Col>
			</Row>
			<Row>
				<Col>
					<Card>
						<CardHeader>
							<CardTitle tag='h3'>{trans('user.profile.profileDetails')}</CardTitle>
						</CardHeader>
						<CardBody>
							<Row>
								<Col xs={6}>
									<span>{trans('user.fname')}</span>
									<p className={'px-25'}>{data.fname ?? '-'}</p>
								</Col>
								<Col xs={6}>
									<span>{trans('user.mname')}</span>
									<p className={'px-25'}>{data.mname ?? '-'}</p>
								</Col>
								<Col xs={6}>
									<span>{trans('user.lname')}</span>
									<p className={'px-25'}>{data.lname ?? '-'}</p>
								</Col>
								<Col xs={6}>
									<span>{trans('user.mobile')}</span>
									<p className={'px-25'}>{data.phone ?? '-'}</p>
								</Col>
								<Col xs={6}>
									<span>{trans('user.email')}</span>
									<p className={'px-25'}>{data.email ?? '-'}</p>
								</Col>
								<Col xs={6}>
									<span>{trans('user.type')}</span>
									<p className={'px-25'}>{_.get(data, 'responsible_type.name') ?? '-'}</p>
								</Col>
							</Row>
						</CardBody>
					</Card>
				</Col>
			</Row>
		</Fragment>
	)
}

ProfileDataTab.propTypes = {

}

export default ProfileDataTab
