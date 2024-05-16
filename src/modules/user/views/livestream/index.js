import React, {Fragment, useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {
	Card,
	CardBody,
	CardHeader,
	Col,
	Row,
	Table,
	Badge, CardTitle
} from "reactstrap"
import {useParams} from "react-router-dom"
import {MoreVertical, User} from "react-feather"
import _ from "lodash"

import {trans, _url} from '@utils'
import Avatar from '@src/components/avatar'
import CardAction from '@components/card-actions'

import {_getActiveElectionLiveStream} from "../../redux/actions"
import CompletedStatsOverview from "./CompletedStatsOverview"
import ElectionStatistics from "./ElectionStatistics"
import BoxesList from "./boxes-list"
import NumberOfCandidatesAndPartiesStats from "./NumberOfCandidatesAndPartiesStats"
import CancelledWhiteStats from "./CancelledWhiteStats"
import "../../assets/scss/style.css"

const BoxView = props => {
	const [livestreamData, setLivestreamData] = useState(null)
	const {id} = useParams()

	const _getLiveStreamData = () => {
		_getActiveElectionLiveStream(id, (data) => setLivestreamData(data))
	}

	useEffect(() => {
		_getLiveStreamData()
		const myInterval = setInterval(
			_getLiveStreamData, 30000)
		return () => {
			clearInterval(myInterval)
		}
	}, [])

	return (
		<Fragment>
			{livestreamData &&
				<>
					<CardAction title={trans('user.electionOverview')} actions={['collapse']}>
						<CardBody>
							<Row className={'match-height'}>
								<Col md={4} xs={12}>
									<CompletedStatsOverview livestreamData={livestreamData} />
								</Col>
								<Col md={8} xs={12}>
									<ElectionStatistics livestreamData={livestreamData} />
								</Col>
							</Row>
						</CardBody>
					</CardAction>
					<Row>
						<Col>
							<BoxesList />
						</Col>
					</Row>
					<Row>
						<Col>
							<h4>{trans('user.liveVotingResult')}</h4>
						</Col>
					</Row>
					<Row className={'match-height'}>
						<Col sm={6}>
							<NumberOfCandidatesAndPartiesStats livestreamData={livestreamData} />
							{/*<Card className='business-card mx-1 my-1'>*/}
							{/*	<CardBody>*/}
							{/*		<Table bordered>*/}
							{/*			<thead>*/}
							{/*			<tr>*/}
							{/*				<th className={'text-center'}>{trans('user.parties')}</th>*/}
							{/*				<th className={'text-center'}>{trans('user.candidates')}</th>*/}
							{/*			</tr>*/}
							{/*			</thead>*/}
							{/*			<tbody>*/}
							{/*			<tr>*/}
							{/*				<th className={'text-center'}>{livestreamData.parties.length}</th>*/}
							{/*				<th className={'text-center'}>{livestreamData.parties.map(x => x.candidates.length)}</th>*/}
							{/*			</tr>*/}
							{/*			</tbody>*/}
							{/*		</Table>*/}
							{/*	</CardBody>*/}
							{/*</Card>*/}
						</Col>
						<Col sm={6}>
							<CancelledWhiteStats livestreamData={livestreamData} />
							{/*<Card className='business-card mx-1 my-1'>*/}
							{/*	<CardBody>*/}
							{/*		<Table bordered>*/}
							{/*			<thead>*/}
							{/*			<tr>*/}
							{/*				<th className={'text-center'}>{trans('user.cancelled')}</th>*/}
							{/*				<th className={'text-center'}>{trans('user.whitePapers')}</th>*/}
							{/*			</tr>*/}
							{/*			</thead>*/}
							{/*			<tbody>*/}
							{/*			<tr>*/}
							{/*				<th className={'text-center'}>{livestreamData.cancelled_votes}</th>*/}
							{/*				<th className={'text-center'}>{livestreamData.white_papers}</th>*/}
							{/*			</tr>*/}
							{/*			</tbody>*/}
							{/*		</Table>*/}
							{/*	</CardBody>*/}
							{/*</Card>*/}
						</Col>
					</Row>
					<Row className={'match-height'}>
						{_.map(_.orderBy(livestreamData.parties, ['pivot.order', ['asc']]), (party, _i) => (
							<Col sm={6} md={4} lg={3}>
								<Card key={party.id} className='business-card'>
									<CardHeader className='pb-1'>
										<CardTitle tag='h4'>{party.name}</CardTitle>
										{/*<MoreVertical size={18} className='cursor-pointer' />*/}
									</CardHeader>
									<CardBody>
										<div className='business-items'>
											<div className='business-item my-1'>
												<div className='d-flex align-items-center justify-content-between'>
													{/*<Avatar img={candidate.image ? _url(candidate.image) : false} icon={!candidate.image ? <User /> : false} imgHeight='25' imgWidth='25' />*/}
													<span className={'mx-1 text-center'}>All List</span>
													<Badge color={'light-success'}>{party.votes_num}</Badge>
												</div>
											</div>
											{_.map(party.candidates, candidate => {
												return (
													<div key={candidate.id} className='business-item my-1'>
														<div className='d-flex align-items-center justify-content-between'>
															<Avatar img={candidate.image ? _url(candidate.image) : false} icon={!candidate.image ? <User /> : false} imgHeight='25' imgWidth='25' />
															<div style={{flex:1}}>
																<span className={'mx-1 text-left'} style={{fontSize:11}}>{candidate.name}</span>
															</div>
															<Badge color={'light-success'}>{candidate.votes_num}</Badge>
														</div>
													</div>
												)
											})}
										</div>
									</CardBody>
								</Card>
							</Col>
						))}
					</Row>
				</>
			}
		</Fragment>
	)
}

BoxView.propTypes = {

}

export default BoxView
