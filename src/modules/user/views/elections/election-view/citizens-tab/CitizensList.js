import React, { Fragment, Component, memo } from 'react'
import { connect } from 'react-redux'
import {MoreVertical, Trash, Eye, CheckCircle, XCircle, Link as LinkIcon, Plus} from 'react-feather'
import {
	Row,
	Col,
	UncontrolledDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem, Badge, Button
} from 'reactstrap'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faPlaneArrival, faPlaneDeparture} from '@fortawesome/free-solid-svg-icons'
import {toast} from 'react-toastify'
//************************************//
import DataTable from '@src/components/datatable'
import {trans, _confirm, _url} from '@utils'
import {AbilityContext, _hasAnyAbility } from '@src/utility/context/Can'
import AvatarGroup from '@components/avatar-group'
//************************************//
import {
	_assignToResponsible,
	_getAllPersonalReligionsWithQ,
	_getAllRecordReligionsWithQ, _getAllResponsiblesWithQ,
	_getAllUsersMunicipalitiesWithQ,
	_immigrantUser,
	_localizeCitizen
} from '../../../../redux/actions'
import CanCall from '../../../../components/CanCall'
import {Genders} from "../../../../utility/Constants"
import AssignToResponsibleModal from "./AssignToResponsibleModal"
import AssignMultipleToResponsibleModal from "./AssignMultipleToResponsibleModal"
import UploadExcelFiles from "./UploadExcelFiles"
//************************************//
const tableColumns = (state, _assign, _immigrant, _localize, _delete, _unAssign, hasAction) => [
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
		name: trans('user.fname'),
		selector: 'fname',
		sortable: true,
		filter: {
			enabled: true,
			type: 'text'
		}
	},
	{
		name: trans('user.mname'),
		selector: 'mname',
		sortable: true,
		filter: {
			enabled: true,
			type: 'text'
		}
	},
	{
		name: trans('user.lname'),
		selector: 'lname',
		sortable: true,
		filter: {
			enabled: true,
			type: 'text'
		}
	},
	{
		name: trans('user.citizens.personalReligion'),
		selector: 'personal_religion',
		sortable: true,
		filter: {
			enabled: true,
			type: 'asyncSelect',
			isMulti: false,
			loadOptions: _getAllPersonalReligionsWithQ
		}
	},
	{
		name: trans('user.citizens.recordReligion'),
		selector: 'record_religion',
		sortable: true,
		filter: {
			enabled: true,
			type: 'asyncSelect',
			isMulti: false,
			loadOptions: _getAllRecordReligionsWithQ
		}
	},
	{
		name: trans('user.citizens.civilRegistration'),
		selector: 'civil_registration',
		sortable: true,
		filter: {
			enabled: true,
			type: 'text'
		}
	},
	{
		name: trans('user.citizens.municipality'),
		selector: 'municipality',
		sortable: true,
		filter: {
			enabled: true,
			type: 'asyncSelect',
			isMulti: true,
			loadOptions: _getAllUsersMunicipalitiesWithQ
		},
		cell: (row, index, column, id) => {
			const municipality = row.municipality_id ? JSON.parse(row.municipality) : null
			return row.municipality_id ? municipality.name : ''
		}
	},
	{
		name: trans('user.gender'),
		selector: 'gender',
		sortable: false,
		omit: true,
		filter: {
			enabled: true,
			type: 'select',
			options: Genders
		}
	},
	{
		name: trans('user.status.status'),
		selector: 'immigrant',
		sortable: false,
		omit: true,
		filter: {
			enabled: true,
			isMulti: false,
			type: 'select',
			options: [{label:trans('user.actions.immigrant'), value: 1}, {label: trans('user.actions.localCitizen'), value: 0}]
		}
	},
	{
		name: trans('user.box'),
		selector: 'box',
		sortable: false,
		cell: (row, index, column, id) => {
			const box = row.box_id ? JSON.parse(row.box) : null
			return row.box_id ? <Link to={`/box/${row.box_id}`}>
				<span>{_.get(box, 'name')}</span>
			</Link> : null
		},
		filter: {
			enabled: false
		}
	},
	{
		name: trans('user.responsible'),
		selector: 'responsibles',
		sortable: true,
		cell: (row, index, column, id) => {
			if (row.responsible && row.responsible.length > 0 && !_.get(row, 'outdoor')) {
				const responsible = JSON.parse(row.responsible)
				return <AvatarGroup data={_.map([responsible], (x) => { return {title: `${x.fname} ${x.mname} ${x.lname}`, img: _url(x.image)} })} />
			} else if (_.get(row, 'outdoor')) {
				return <Badge color={`light-info`}><FontAwesomeIcon icon={faPlaneDeparture} /></Badge>
			} else {
				return null
			}
		},
		filter: {
			enabled: true,
			type: 'asyncSelect',
			isMulti: true,
			loadOptions: _getAllResponsiblesWithQ
		}
	},
	{
		name: trans('user.color'),
		selector: 'color',
		sortable: false,
		filter: {
			enabled: true,
			type: 'select',
			options: [{label:trans('user.white'), value: 'white'}, {label: trans('user.grey'), value: 'grey'}, {label: trans('user.black'), value: 'black'}]
		}
	},
	{
		name: trans('user.arrived'),
		selector: 'arrived',
		sortable: false,
		cell: (row, index, column, id) => {
			return row.arrived ? <CheckCircle color={'#0ea400'} size={21} /> : null
		},
		filter: {
			enabled: true,
			type: 'select',
			options: [{label:trans('user.arrived'), value: 1}, {label: trans('user.notArrived'), value: 0}]
		}
	},
	{
		name: trans('user.voted'),
		selector: 'voted',
		sortable: false,
		cell: (row, index, column, id) => {
			return row.voted ? <CheckCircle color={'#0ea400'} size={21} /> : null
		},
		filter: {
			enabled: true,
			type: 'select',
			options: [{label:trans('user.voted'), value: 1}, {label: trans('user.notVoted'), value: 0}]
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
							<CanCall action='CITIZENS_VIEW_CITIZEN' id={`viewUser_${row.user_id}`}>
								<Link to={`/citizens/${row.user_id}`} className='w-100 dropdown-item' >
									<Eye size={15} />
									<span className='align-middle ml-50'>{trans('gen.actions.view')}</span>
								</Link>
							</CanCall>
							{/*<CanCall action='CITIZENS_EDIT_CITIZEN' id={`updateUser_${row.user_id}`}>*/}
							{/*	<DropdownItem  className='w-100' onClick={e => _assign(row)}>*/}
							{/*		<FileText size={15} />*/}
							{/*		<span className='align-middle ml-50'>{trans('gen.actions.edit')}</span>*/}
							{/*	</DropdownItem>*/}
							{/*</CanCall>*/}
							{_.get(row, 'outdoor') ? <CanCall action='ELECTIONS_LOCALIZE_CITIZEN' id={`intdoorUser_${row.user_id}`}>
								<DropdownItem className='w-100 btn-flat-info' onClick={e => _localize(row.user_id)}>
									<FontAwesomeIcon icon={faPlaneArrival} />
									<span className='align-middle ml-50'>{trans('user.actions.localCitizen')}</span>
								</DropdownItem>
							</CanCall> : <CanCall action='ELECTIONS_IMMIGRANT_CITIZEN' id={`outdoorUser_${row.user_id}`}>
								<DropdownItem className='w-100 btn-flat-info' onClick={e => _immigrant(row.user_id)}>
									<FontAwesomeIcon icon={faPlaneDeparture} />
									<span className='align-middle ml-50'>{trans('user.actions.immigrant')}</span>
								</DropdownItem>
							</CanCall>}
							{!_.get(row, 'outdoor') ? row.responsible && row.responsible.length > 0 ? <CanCall action='ELECTIONS_UNASSIGN_CITIZEN_TO_RESPONSIBLE' id={`assignUser_${row.user_id}`}>
								<DropdownItem className='w-100 btn-flat-light-danger' onClick={e => _unAssign(row.user_id)}>
									<XCircle size={15}/>
									<span className='align-middle ml-50'>{trans('user.unAssign')}</span>
								</DropdownItem>
							</CanCall> : <CanCall action='ELECTIONS_ASSIGN_CITIZEN_TO_RESPONSIBLE' id={`assignUser_${row.user_id}`}>
								<DropdownItem className='w-100 btn-flat-info' onClick={e => _assign(row)}>
									<LinkIcon size={15}/>
									<span className='align-middle ml-50'>{trans('user.assignToResponsible')}</span>
								</DropdownItem>
							</CanCall> : null}
							<CanCall action='ELECTIONS_DELETE_CITIZEN' id={`deleteUser_${row.user_id}`}>
								<DropdownItem className='w-100 btn-flat-danger' onClick={e => _delete(row.user_id)}>
									<Trash size={15}/>
									<span className='align-middle ml-50'>{trans('gen.actions.delete')}</span>
								</DropdownItem>
							</CanCall>
						</DropdownMenu>
					</UncontrolledDropdown>
				</div>
			)
		}
	}
]
const tableActions = ['CITIZENS_VIEW_CITIZEN', 'ELECTIONS_LOCALIZE_CITIZEN', 'ELECTIONS_IMMIGRANT_CITIZEN', 'ELECTIONS_ASSIGN_CITIZEN_TO_RESPONSIBLE', 'ELECTIONS_UNASSIGN_CITIZEN_TO_RESPONSIBLE', 'ELECTIONS_DELETE_CITIZEN']
//************************************//
class CitizensList extends Component {
	static contextType = AbilityContext
	constructor(props) {
		super(props)
		this.state = {
			userId: props.userId,
			assignModal: {assignModalShow: false, assignModalData: {}},
			assignMultipleModal: {assignMultipleModalShow: false, assignMultipleModalData: {}},
			selectedRows: {allSelected:false, selectedCount:0, selectedRows:[]},
			refreshSelected:false
		}
		this._assign = this._assign.bind(this)
	}
	//************************************//
	refreshInteval;
	componentDidMount() {
		this.refreshInteval = setInterval(() => {
			if (!this.props.loading) {
				this.dataTableRef._refresh()
			}
		}, 30000)
	}
	//************************************//
	componentWillUnmount() {
		clearInterval(this.refreshInteval)
		toast.dismiss()
	}
	//************************************//
	_assign = (data) => {
		this.setState({assignModal: {assignModalShow: true, assignModalData: {...data, id:data.user_id}}})
	}
	//************************************//
	_assignMultiple = () => {
		this.setState({assignMultipleModal: {assignMultipleModalShow: true, assignMultipleModalData: this.state.selectedRows}})
	}
	//************************************//
	_closeAssignToResponsileModal = () => {
		this.setState({assignModal: {assignModalShow: false, assignModalData: {}}})
	}
	//************************************//
	_closeAssignMultipleToResponsileModal = () => {
		this.setState({assignMultipleModal: {assignMultipleModalShow: false, assignMultipleModalData: {}}})
	}
	//************************************//
	_delete = (id) => {
		// _confirm({
		// 	callback: (c) => {
		// 		_deleteTempUser(id, () => {
		// 			this.dataTableRef._refresh()
		// 			c()
		// 		})
		// 	}
		// })
	}
	//************************************//
	_unAssign = (id) => {
		_confirm({
			callback: (c) => {
				_assignToResponsible(
					{responsible_id: null, election_id:this.props.electionId, user_ids: [id]},
					() => {
						this.dataTableRef._refresh()
						c()
					},
					() => {}
				)
			}
		})
	}
	//************************************//
	_immigrant = (id) => {
		_confirm({
			callback: (c) => {
				_immigrantUser({id, election_id:this.props.electionId}, () => {
					this.dataTableRef._refresh()
					c()
				})
			}
		})
	}
	//************************************//
	_localize = (id) => {
		_confirm({
			callback: (c) => {
				_localizeCitizen({id, election_id:this.props.electionId}, () => {
					this.dataTableRef._refresh()
					c()
				})
			}
		})
	}
	//************************************//
	render () {
		const {assignModalShow, assignModalData} = this.state.assignModal
		const {assignMultipleModalShow, assignMultipleModalData} = this.state.assignMultipleModal
		const hasAction = _hasAnyAbility(this.context, tableActions)
		return (
			<Fragment>
				<Row>
					<Col sm='12'>
						<CanCall action='ELECTIONS_IMPORT_EXCEL'>
							<UploadExcelFiles rules={{type:['xlsx', 'xls']}} electionId={this.props.electionId} />
						</CanCall>
					</Col>
				</Row>
				<Row>
					<Col sm='12'>
						<DataTable ref={(ref) => { this.dataTableRef = ref }} uri={`election/${this.props.electionId}/users/index`} columns={tableColumns(this.state, this._assign, this._immigrant, this._localize, this._delete, this._unAssign, hasAction)} hasIndexing={false} hasFilter={true} hasSelectedRow={true} onSelectedChange={selectedRows => {
							if (selectedRows.selectedCount > 0) {
								toast.dismiss()
								toast(
									<div>
										<h5>Number of selected citizens: {selectedRows.selectedCount}</h5>
										<Button color={'primary'} onClick={() => {
											this._assignMultiple()
											toast.dismiss()
										}}>Assign to responsible</Button>
									</div>,
									{autoClose:false, closeButton: <></>, closeOnClick: false, draggable: false})
							} else {
								toast.dismiss()
							}
							this.setState({selectedRows})
						}} refreshSelected={this.state.refreshSelected} forceRefreshSelected={() => this.setState({selectedRows:{}, refreshSelected: !this.state.refreshSelected})}/>
					</Col>
				</Row>
				{assignModalShow && <AssignToResponsibleModal  successCallback={this.dataTableRef._refresh} data={assignModalData} onClose={this._closeAssignToResponsileModal} />}
				{assignMultipleModalShow && <AssignMultipleToResponsibleModal  successCallback={() => {
					this.dataTableRef._refresh()
					this._closeAssignMultipleToResponsileModal()
					toast.dismiss()
					this.setState({selectedRows:{}, refreshSelected: !this.state.refreshSelected})
				}} data={assignMultipleModalData} onClose={() => {
					this._closeAssignMultipleToResponsileModal()
					toast(
						<div>
							<h5>{trans('numberOfSelectedCitizens', {number:this.state.selectedRows.selectedCount})}</h5>
							<CanCall action='ELECTIONS_ASSIGN_CITIZEN_TO_RESPONSIBLE' id={`assignUser`}>
								<Button color={'primary'} onClick={() => {
									this._assignMultiple()
									toast.dismiss()
								}}>{trans('user.assignToResponsible')}</Button>
							</CanCall>
						</div>,
						{autoClose:false, closeButton: <></>, closeOnClick: false, draggable: false})
				}}/>}
			</Fragment>
		)
	}
}
//************************************//
const mapStateToProps = store => ({
	loading: store.app.loading,
	userId: _.get(store, `${process.env.REACT_APP_AUTH_MODULE}.userData.id`)
})
export default connect(mapStateToProps, null, null, { forwardRef: true })(CitizensList)
