import React, { Fragment, Component, memo } from 'react'
import { connect } from 'react-redux'
import {FileText, MoreVertical, Send, Plus, Key, User, Trash, Eye, CheckCircle, XCircle} from 'react-feather'
import {
	Row,
	Col,
	Button,
	UncontrolledDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem, Badge, Progress
} from 'reactstrap'
import { Link } from 'react-router-dom'
//************************************//
import Breadcrumbs from '@src/components/breadcrumbs'
import DataTable from '@src/components/datatable'
import {trans, _confirm, _url} from '@utils'
import {AbilityContext, _hasAnyAbility } from '@src/utility/context/Can'
import Avatar from '@components/avatar'
//************************************//
import CanCall from '../../../../components/CanCall'
import {
	_activateBox,
	_closeBox,
	_deleteBox,
	_getAllDelegatesWithQ,
	_getAllUsersMunicipalitiesWithQ
} from "../../../../redux/actions"
//************************************//
const tableColumns = (state, _close, _activate, hasAction) => [
	{
		name: 'ID',
		selector: 'id',
		sortable: false,
		minWidth: '225px',
		omit: true,
		filter: {
			enabled: false
		}
	},
	{
		name: trans('user.name'),
		selector: 'name',
		sortable: true,
		filter: {
			enabled: false,
			type: 'text'
		}
	},
	{
		name: trans('user.citizens.municipality'),
		selector: 'municipality',
		sortable: false,
		filter: {
			enabled: false,
			type: 'asyncSelect',
			isMulti: true,
			loadOptions: _getAllUsersMunicipalitiesWithQ
		}
	},
	{
		name: trans('user.delegate'),
		selector: 'delegate',
		sortable: false,
		minWidth: '125px',
		cell: (row, index, column, id) => {
			return _.get(row, 'delegate.id') ? <Link to={`/teams/${_.get(row, 'delegate.id')}`} className='w-100' >
				<Badge pill color='light-secondary'>{_.get(row, 'delegate.fname')} {_.get(row, 'delegate.lname')}</Badge>
			</Link> : null
		},
		filter: {
			enabled: true,
			type: 'asyncSelect',
			isMulti: true,
			loadOptions: _getAllDelegatesWithQ
		}
	},
	{
		name: trans('user.#OfVoters'),
		selector: '#OfVoters',
		sortable: false,
		filter: {
			enabled: false,
			type: 'text'
		}
	},
	{
		name: trans('user.votingProcess'),
		selector: 'votingProcess',
		sortable: false,
		minWidth: '225px',
		cell: (row, index, column, id) => {
			return <div className={'w-100'}>
				<span>{`${row.votingProcess}%`}</span>
				<Progress value={`${row.votingProcess}`} />
			</div>
		},
		filter: {
			enabled: false,
			type: 'text'
		}
	},
	{
		name: trans('user.room#'),
		selector: 'room_number',
		sortable: false,
		filter: {
			enabled: false,
			type: 'text'
		}
	},
	{
		name: trans('user.sheet#'),
		selector: 'sheet_id',
		sortable: false,
		filter: {
			enabled: false,
			type: 'text'
		}
	},
	{
		name: trans('user.status.status'),
		selector: 'status',
		sortable: false,
		cell: (row, index, column, id) => {
			if (row.is_closed) {
				return <Badge pill color='light-danger'>{trans('user.status.closed')}</Badge>
			} else if (row.close_request) {
				return <Badge pill color='light-warning'>{trans('user.status.pending')}</Badge>
			} else {
				return <Badge pill color='light-success'>{trans('user.status.active')}</Badge>
			}
		},
		filter: {
			enabled: true,
			type: 'select',
			options: [{label:trans('user.status.closed'), value: 'closed'}, {label:trans('user.status.pending'), value: 'pending'}]
		}
	},
	{
		name: trans('gen.actions.actions'),
		allowOverflow: true,
		omit: !hasAction,
		cell: (row, index, column, id) => {
			return (
				<div className='d-flex'>
					<UncontrolledDropdown>
						<DropdownToggle className='pr-1' tag='span'>
							<MoreVertical size={15} />
						</DropdownToggle>
						<DropdownMenu right>

								{!row.is_closed && row.close_request ? <CanCall action='ELECTION_CLOSE_BOX' id={`deleteUser_${row.id}`}> <DropdownItem className='w-100 btn-flat-danger' onClick={e => _close(row.id)}>
										<XCircle size={15}/>
										<span className='align-middle ml-50'>{trans('user.actions.close')}</span>
									</DropdownItem> </CanCall> : <CanCall action='ELECTION_ACTIVATE_BOX' id={`deleteUser_${row.id}`}> <DropdownItem className='w-100 btn-flat-success' onClick={e => _activate(row.id)}>
											<CheckCircle size={15}/>
											<span className='align-middle ml-50'>{trans('user.actions.activate')}</span>
										</DropdownItem> </CanCall>
								}
						</DropdownMenu>
					</UncontrolledDropdown>
				</div>
			)
		}
	}
]
const tableActions = ['ELECTION_CLOSE_BOX', 'ELECTION_ACTIVATE_BOX']
//************************************//
class BoxesCloseRequestsList extends Component {
	static contextType = AbilityContext
	constructor(props) {
		super(props)
		this.state = {
			userId: props.userId
		}
	}
	//************************************//
	refreshInteval;
	componentDidMount() {
		this.refreshInteval = setInterval(this.dataTableRef._refresh, 30000)
	}
	//************************************//
	componentWillUnmount() {
		clearInterval(this.refreshInteval)
	}
	//************************************//
	_close = (id) => {
		_confirm({
			callback: (c) => {
				_closeBox(id, () => {
					this.dataTableRef._refresh()
					c()
				})
			}
		})
	}
	//************************************//
	_activate = (id) => {
		_confirm({
			callback: (c) => {
				_activateBox(id, () => {
					this.dataTableRef._refresh()
					c()
				})
			}
		})
	}
	render () {
		const hasAction = _hasAnyAbility(this.context, tableActions)
		return (
			<Fragment>
				<Row>
					<Col sm='12'>
						<DataTable ref={(ref) => { this.dataTableRef = ref }} uri={`box/index/${this.props.electionId}/close-requests`} columns={tableColumns(this.state, this._close, this._activate, hasAction)} hasIndexing={true} hasFilter={true}/>
					</Col>
				</Row>
			</Fragment>
		)
	}
}
//************************************//
const mapStateToProps = store => ({
	loading: store.app.loading,
	userId: _.get(store, `${process.env.REACT_APP_AUTH_MODULE}.userData.id`)
})
export default connect(mapStateToProps, null, null, { forwardRef: true })(BoxesCloseRequestsList)
