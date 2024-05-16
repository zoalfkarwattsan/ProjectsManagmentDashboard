import React, { Fragment, Component, memo } from 'react'
import { connect } from 'react-redux'
import {FileText, MoreVertical, Send, Plus, Key, User, Trash, Eye, RefreshCw} from 'react-feather'
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
import BasicInfoModal from "./BasicInfoModal"
import {_deleteBox, _getAllDelegatesWithQ, _getAllUsersMunicipalitiesWithQ, _resetBox} from "../../../../redux/actions"
//************************************//
const tableColumns = (state, _edit, _delete, _reset, hasAction) => [
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
			enabled: true,
			type: 'text'
		}
	},
	{
		name: trans('user.citizens.municipality'),
		selector: 'municipality',
		sortable: false,
		filter: {
			enabled: true,
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
			options: [{label:trans('user.status.closed'), value: 'closed'}, {label:trans('user.status.pending'), value: 'pending'}, {label:trans('user.status.active'), value: 'active'}]
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
							<CanCall action='ELECTIONS_VIEW_BOX' id={`viewUser_${row.id}`}>
								<Link to={`/box/${row.id}`} className='w-100 dropdown-item' >
									<Eye size={15} />
									<span className='align-middle ml-50'>{trans('gen.actions.view')}</span>
								</Link>
							</CanCall>
							<CanCall action='ELECTIONS_EDIT_BOX' id={`updateUser_${row.id}`}>
								<DropdownItem  className='w-100' onClick={e => _edit(row)}>
									<FileText size={15} />
									<span className='align-middle ml-50'>{trans('gen.actions.edit')}</span>
								</DropdownItem>
							</CanCall>
							<CanCall action='ELECTIONS_DELETE_BOX' id={`deleteUser_${row.id}`}>
								<DropdownItem className='w-100 btn-flat-danger' onClick={e => _delete(row.id)}>
									<Trash size={15}/>
									<span className='align-middle ml-50'>{trans('gen.actions.delete')}</span>
								</DropdownItem>
							</CanCall>
							<CanCall action='ELECTIONS_RESET_BOX' id={`reset_${row.id}`}>
								<DropdownItem className='w-100 btn-flat-danger' onClick={e => _reset(row.id)}>
									<RefreshCw size={15}/>
									<span className='align-middle ml-50'>{trans('user.actions.reset')}</span>
								</DropdownItem>
							</CanCall>
						</DropdownMenu>
					</UncontrolledDropdown>
				</div>
			)
		}
	}
]
const tableActions = ['ELECTIONS_VIEW_BOX', 'ELECTIONS_EDIT_BOX', 'ELECTIONS_DELETE_BOX', 'ELECTIONS_RESET_BOX']
//************************************//
class BoxesList extends Component {
	static contextType = AbilityContext
	constructor(props) {
		super(props)
		this.state = {
			userId: props.userId,
			basicInfoModal: {basicInfoModalShow: false, basicInfoModalData: {}}
		}
		this._editModal = this._editModal.bind(this)
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
	_closeModal = () => {
		this.setState({basicInfoModal: {basicInfoModalShow: false, basicInfoModalData: {}}})
	}
	//************************************//
	_openModal = () => {
		this.setState({basicInfoModal: {basicInfoModalShow: true, basicInfoModalData: {}}})
	}
	//************************************//
	_editModal = (data) => {
		this.setState({basicInfoModal: {basicInfoModalShow: true, basicInfoModalData: data}})
	}
	//************************************//
	_delete = (id) => {
		_confirm({
			callback: (c) => {
				_deleteBox(id, () => {
					this.dataTableRef._refresh()
					c()
				})
			}
		})
	}
	//************************************//
	_reset = (id) => {
		_confirm({
			callback: (c) => {
				_resetBox(id, () => {
					this.dataTableRef._refresh()
					c()
				})
			}
		})
	}
	render () {
		const {basicInfoModalShow, basicInfoModalData} = this.state.basicInfoModal
		const hasAction = _hasAnyAbility(this.context, tableActions)
		return (
			<Fragment>
				<Breadcrumbs breadCrumbMainTitle={''} breadCrumbTitle={''} breadCrumbParent='' breadCrumbActive='' >
					<CanCall action='ELECTIONS_ADD_BOX' id='addUserBtn'>
						<Button.Ripple className='btn-icon' color='primary' onClick={this._openModal}>
							<Plus size={14} />
							<span className='ml-25'>{trans('gen.actions.add')}</span>
						</Button.Ripple>
					</CanCall>
				</Breadcrumbs>
				<Row>
					<Col sm='12'>
						<DataTable ref={(ref) => { this.dataTableRef = ref }} uri={`election/${this.props.electionId}/boxes/index`} columns={tableColumns(this.state, this._editModal, this._delete, this._reset, hasAction)} hasIndexing={true} hasFilter={true}/>
					</Col>
				</Row>
				{basicInfoModalShow && <BasicInfoModal  successCallback={this.dataTableRef._refresh} data={basicInfoModalData} onClose={this._closeModal}/>}
			</Fragment>
		)
	}
}
//************************************//
const mapStateToProps = store => ({
	loading: store.app.loading,
	userId: _.get(store, `${process.env.REACT_APP_AUTH_MODULE}.userData.id`)
})
export default connect(mapStateToProps, null, null, { forwardRef: true })(BoxesList)
