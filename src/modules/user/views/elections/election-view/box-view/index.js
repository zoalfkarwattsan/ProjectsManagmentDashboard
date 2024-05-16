import React, {Fragment, useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {Card, CardBody, CardHeader, Col, Progress, Row, Table} from "reactstrap"
import {useParams} from "react-router-dom"
import {Briefcase, CheckCircle, CheckSquare, Hash, XCircle} from "react-feather"

import StatsVertical from '@components/widgets/stats/StatsVertical'
import {trans} from '@utils'

import {_getBoxInfo, _getProjectInfo} from "../../../../redux/actions"
import "../../../../assets/scss/style.css"
import CitizensList from "./CitizensList"

const BoxView = props => {
	const [boxData, setBoxData] = useState(null)
	const {id} = useParams()

	const _getBoxData = () => {
		_getBoxInfo(id, (data) => setBoxData(data.box))
	}

	useEffect(() => {
		_getBoxData()
		const myInterval = setInterval(
			_getBoxData, 30000)
		return () => {
			clearInterval(myInterval)
		}
	}, [])

	return (
		<Fragment>
			{boxData &&
				<>
					<Row>
						<Col sm='4' xs='12'>
							<StatsVertical icon={<Hash size={21} />} color='secondary' stats={`${boxData.total_voters}`} statTitle={trans('user.total#OfVoters')} />
						</Col>
						<Col sm='4' xs='12'>
							<StatsVertical icon={<CheckCircle size={21} />} color='success' stats={`${boxData.total_voted_num}`} statTitle={trans('user.total#OfVoted')} />
						</Col>
						<Col sm='4' xs='12'>
							<StatsVertical icon={<XCircle size={21} />} color='danger' stats={`${boxData.remaining_total_voted_num}`} statTitle={trans('user.total#OfRemainingVoters')} />
						</Col>
					</Row>
					<Row>
						<Col>
							<Card>
								<CardHeader>
									<h4>{trans('user.ranges')}</h4>
								</CardHeader>
								<CardBody>
									<Row>
										<Col>
											<Table striped responsive>
												<thead>
												<tr>
													<th>{trans('user.civilRegistrationFrom')}</th>
													<th>{trans("user.civilRegistrationTo")}</th>
													<th>{trans("user.religion")}</th>
													<th>{trans("user.gender")}</th>
												</tr>
												</thead>
												<tbody>
												{_.map(boxData.electors, (x, i) => {
													return (
														<tr key={i}>
															<th>{x['civil_registration_from']}</th>
															<th>{x['civil_registration_to']}</th>
															<th>{x['religion']}</th>
															<th>{x['gender']}</th>
														</tr>
													)
												})}
												</tbody>
											</Table>
										</Col>
									</Row>
									<Row className={'mt-2'}>
										<Col>
											<h4>{trans('user.votingProcess')}</h4>
											<span>{`${boxData.total_voters > 0 ? Math.floor((boxData.total_voted_num / boxData.total_voters) * 100) : 0}%`}</span>
											<Progress value={`${boxData.total_voters > 0 ? Math.floor((boxData.total_voted_num / boxData.total_voters) * 100) : 0}`} />
										</Col>
									</Row>
								</CardBody>
							</Card>
						</Col>
					</Row>
					<Row>
						<Col>
							<h4>{trans('user.expectedVotes')}</h4>
						</Col>
					</Row>
					<Row>
						<Col sm='4' xs='12'>
							<StatsVertical additionalClassName={'black'} icon={<></>} color='secondary' stats={`${boxData.black}`} statTitle={''} />
						</Col>
						<Col sm='4' xs='12'>
							<StatsVertical additionalClassName={'grey'} icon={<></>} color='success' stats={`${boxData.grey}`} statTitle={''} />
						</Col>
						<Col sm='4' xs='12'>
							<StatsVertical additionalClassName={'white'} icon={<></>} color='danger' stats={`${boxData.white}`} statTitle={''} />
						</Col>
					</Row>
					<Row>
						<Col>
							<CitizensList boxId={id} />
						</Col>
					</Row>
				</>
			}
		</Fragment>
	)
}

BoxView.propTypes = {

}

export default BoxView
