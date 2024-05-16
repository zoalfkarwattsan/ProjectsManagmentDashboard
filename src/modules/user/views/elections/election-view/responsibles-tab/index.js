import React, {Fragment, useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import { ReactSortable } from 'react-sortablejs'
import {
	Card,
	CardHeader,
	CardBody,
	CardTitle,
	CardText,
	Col,
	DropdownToggle,
	DropdownMenu,
	DropdownItem, UncontrolledDropdown, Row, Button, FormGroup, Label
} from 'reactstrap'
import {FileText, MoreVertical, Move, Plus, Power, Trash, User} from "react-feather"
import {useParams} from "react-router-dom"

import '@styles/react/libs/drag-and-drop/drag-and-drop.scss'
import {trans, _confirm, _url} from '@utils'
import Avatar from '@components/avatar'

import {
	_deleteCandidate,
	_deleteElectionParty,
	_deleteParty,
	_getElectionParties,
	_reOrderParties
} from "../../../../redux/actions"
import PartyModal from "./PartyModal"
import CandidateModal from "./CandidateModal"
import _ from "lodash"

const PartiesTab = props => {
	const [parties, setParties] = useState([])
	const [partyModal, setPartyModal] = useState({show: false, data: {}})
	const [candidateModal, setCandidateModal] = useState({show: false, data: {}})
	const {id} = useParams()

	const _getParties = () => {
		_getElectionParties(id, (data) => setParties(_.orderBy(data, ['pivot.order', ['asc']])))
	}

	const _openPartyModal = () => {
		setPartyModal({show:true, data:{electionId:id}})
	}

	const _editPartyModal = (data) => {
		setPartyModal({show:true, data})
	}

	const _closePartyModal = () => {
		setPartyModal({show:false, data:{}})
	}

	//************************************//
	const _deleteParty = (partyId) => {
		_confirm({
			callback: (c) => {
				_deleteElectionParty(partyId, id, () => {
					_getParties()
					c()
				})
			}
		})
	}

	const _openCandidateModal = (partyId) => {
		setCandidateModal({show:true, data:{partyId, electionId:id}})
	}

	const _editCandidateModal = (data) => {
		setCandidateModal({show:true, data})
	}

	const _closeCandidateModal = () => {
		setCandidateModal({show:false, data:{}})
	}

	//************************************//
	const _deleteCandidateSwal = (id) => {
		_confirm({
			callback: (c) => {
				_deleteCandidate(id, () => {
					_closeCandidateModal()
					_getParties()
					c()
				})
			}
		})
	}

	useEffect(() => {
		_getParties()
	}, [])


	return (
		<Fragment>
			<Row>
				<Col>
					<FormGroup>
						<Button.Ripple className='btn-icon' color='primary' onClick={_openPartyModal}>
							<Plus size={14} />
							<span className='ml-25'>{trans('user.actions.addParty')}</span>
						</Button.Ripple>
					</FormGroup>
				</Col>
			</Row>
			<Row>
				<Col>
					<ReactSortable
						group='shared-handle-group'
						handle='.handle'
						className='overflow-auto d-flex align-item-start overflow-auto'
						list={parties}
						setList={(list) => {
							if (!_.isEqual(list.map(x => x.id), parties.map(x => x.id))) {
								_reOrderParties(_.map(list, x => x.id), id, () => {})
							}
							setParties(list)
						}}
					>
						{_.map(parties, (party, _i) => (
							<Card className={`mx-25`} key={party.id} style={{flex:'0 0 275px'}}>
								<CardHeader>
									<Move className={'handle cursor-move'} size={14} />
									<span>{_i + 1} - {party.name}</span>
									<UncontrolledDropdown>
										<DropdownToggle className='pr-1' tag='span'>
											<MoreVertical size={15} />
										</DropdownToggle>
										<DropdownMenu right>
											<DropdownItem  className='w-100' onClick={() => _editPartyModal(party)}>
												<FileText size={15} className='mr-75' />
												<span className='align-middle'>
													{trans('gen.actions.edit')}
											</span>
											</DropdownItem>
											<DropdownItem className='w-100 btn-flat-danger' onClick={() => _deleteParty(party.id)}>
												<Trash size={15}/>
												<span className='align-middle ml-50'>{trans('gen.actions.delete')}</span>
											</DropdownItem>
										</DropdownMenu>
									</UncontrolledDropdown>
								</CardHeader>
								<CardBody>
									<span onClick={() => _openCandidateModal(party.id)}><Label className={'cursor-pointer'}>{trans('user.actions.addNewCandidate')}</Label></span>
									<hr />
									{_.map(party.candidates, candidate => {
										return (
											<Fragment key={candidate.id}>
												<Row onClick={() => _editCandidateModal(candidate)} key={candidate.id} className={'mt-1 cursor-pointer'}>
													<Col>
														<Avatar img={candidate.image ? _url(candidate.image) : false} icon={!candidate.image ? <User /> : false} imgHeight='35' imgWidth='35' />
														<span className={'mx-1'}>{candidate.fname} {candidate.mname} {candidate.lname}</span>
													</Col>
												</Row>
												<hr />
											</Fragment>
										)
									})}
								</CardBody>
							</Card>
						))}
					</ReactSortable>
				</Col>
			</Row>
			{partyModal.show && <PartyModal successCallback={_getParties} data={partyModal.data} onClose={_closePartyModal}/>}
			{candidateModal.show && <CandidateModal successCallback={_getParties} _deleteCandidateSwal={_deleteCandidateSwal} data={candidateModal.data} onClose={_closeCandidateModal}/>}
		</Fragment>
	)
}

PartiesTab.propTypes = {

}

export default PartiesTab
