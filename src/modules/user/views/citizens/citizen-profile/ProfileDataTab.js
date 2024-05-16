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
									<span>{trans('user.motherName')}</span>
									<p className={'px-25'}>{data.mother_name ?? '-'}</p>
								</Col>
								<Col xs={6}>
									<span>{trans('user.bDate')}</span>
									<p className={'px-25'}>{data.birth_date ?? '-'}</p>
								</Col>
								<Col xs={6}>
									<span>{trans('user.gender')}</span>
									<p className={'px-25'}>{data.gender ?? '-'}</p>
								</Col>
								<Col xs={6}>
									<span>{trans('user.nationality')}</span>
									<p className={'px-25'}>{data?.nationality?.name ?? '-'}</p>
								</Col>
								<Col xs={6}>
									<span>{trans('user.citizens.municipality')}</span>
									<p className={'px-25'}>{data?.municipality?.name ?? '-'}</p>
								</Col>
								<Col xs={6}>
									<span>{trans('user.citizens.civilRegistration')}</span>
									<p className={'px-25'}>{data.civil_registration ?? '-'}</p>
								</Col>
								<Col xs={6}>
									<span>{trans('user.citizens.personalReligion')}</span>
									<p className={'px-25'}>{data.personal_religion ?? '-'}</p>
								</Col>
								<Col xs={6}>
									<span>{trans('user.citizens.recordReligion')}</span>
									<p className={'px-25'}>{data.record_religion ?? '-'}</p>
								</Col>
								<Col xs={6}>
									<span>{trans('user.mobile')}</span>
									<p className={'px-25'}>{data.phone ?? '-'}</p>
								</Col>
								<Col xs={6}>
									<span>{trans('user.email')}</span>
									<p className={'px-25'}>{data.email ?? '-'}</p>
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
