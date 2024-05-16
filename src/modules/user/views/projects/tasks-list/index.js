import React, { Fragment, Component, memo } from 'react'
import { connect } from 'react-redux'
import {FileText, MoreVertical, Send, Plus, Key, User, Trash, Eye} from 'react-feather'
import {
	Row,
	Col,
	Button,
	UncontrolledDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem, Badge, UncontrolledTooltip
} from 'reactstrap'
import { Link } from 'react-router-dom'
//************************************//
import Breadcrumbs from '@src/components/breadcrumbs'
import DataTable from '@src/components/datatable'
import {trans, _confirm, _url} from '@utils'
import {AbilityContext, _hasAnyAbility } from '@src/utility/context/Can'
import AvatarGroup from '@components/avatar-group'
import Avatar from '@components/avatar'
//************************************//
import CanCall from '../../../components/CanCall'
import BasicInfoModal from "./BasicInfoModal"
import {_deleteTask} from "../../../redux/actions"
//************************************//
const tableColumns = (state, _edit, _delete, hasAction) => [
	{
		name: 'ID',
		selector: 'id',
		sortable: false,
		maxWidth: '25px',
		omit: true,
		filter: {
			enabled: false
		}
	},
	{
		name: trans('user.name'),
		selector: 'name',
		sortable: false,
		minWidth:"200px",
		filter: {
			enabled: true,
			type:'text'
		}
	},
	{
		name: trans('user.description'),
		selector: 'description',
		sortable: false,
		minWidth:"200px",
		filter: {
			enabled: true,
			type:'text'
		}
	},
	{
		name: trans('user.dueDate'),
		selector: 'due_date',
		sortable: false,
		cell: (row, index, column, id) => {
			return row.due_date && <Badge color='light-danger'>{row.due_date.split(' ')[0]}</Badge>
		},
		filter: {
			enabled: false
		}
	},
	{
		name: trans('user.projectManagers'),
		selector: 'responsibles',
		sortable: false,
		cell: (row, index, column, id) => {
			return row.responsible && <AvatarGroup data={_.map([row.responsible], (x) => {
				return {title: `${x.fname.replaceAll('.', '')} ${x.lname.replaceAll('.', '')}`, img: _url(x.image)}
			})} />
		},
		filter: {
			enabled: false
		}
	},
	{
		name: trans('user.status.status'),
		selector: 'status',
		sortable: false,
		cell: (row, index, column, id) => {
			if (row.status_id === 5 && row.failed_reason) {
				return <Row className={'mx-0'}>
					<Badge pill color={row.status.icon_color}>{row.status.name}</Badge>
					<Fragment>
						<div id={`av-tooltip-${row.id}`}>
							<Eye size={17} className='mx-1' />
						</div>
						<UncontrolledTooltip placement='top' target={`av-tooltip-${row.id}`}>
							<span className='font-weight-bold'>{row.failed_reason}</span>
						</UncontrolledTooltip>
					</Fragment>
				</Row>
			}
			return <Badge pill color={row.status.icon_color}>{row.status.name}</Badge>
		},
		filter: {
			enabled: false
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
							<CanCall action='PROJECTS_EDIT_TASK' id={`updateUser_${row.id}`}>
								<DropdownItem  className='w-100' onClick={e => _edit(row)}>
									<FileText size={15} />
									<span className='align-middle ml-50'>{trans('gen.actions.edit')}</span>
								</DropdownItem>
							</CanCall>
							<CanCall action='PROJECTS_DELETE_TASK' id={`deleteUser_${row.id}`}>
								<DropdownItem className='w-100 btn-flat-danger' onClick={e => _delete(row.id)}>
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
const tableActions = ['PROJECTS_EDIT_TASK', 'PROJECTS_DELETE_TASK']
//************************************//
class TasksList extends Component {
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
		this.setState({basicInfoModal: {basicInfoModalShow: true, basicInfoModalData: {projectId:this.props.projectId}}})
	}
	//************************************//
	_editModal = (data) => {
		this.setState({basicInfoModal: {basicInfoModalShow: true, basicInfoModalData: {...data, projectId:this.props.projectId}}})
	}
	//************************************//
	_delete = (id) => {
		_confirm({
			callback: (c) => {
				_deleteTask(id, () => {
					this.dataTableRef._refresh()
					this.props.onSuccessCallback()
					c()
				})
			}
		})
	}
	//************************************//
	render () {
		const {basicInfoModalShow, basicInfoModalData} = this.state.basicInfoModal
		const hasAction = _hasAnyAbility(this.context, tableActions)
		return (
			<Fragment>
				<Breadcrumbs breadCrumbMainTitle={''} breadCrumbTitle={trans('user.tasks')} breadCrumbParent='' breadCrumbActive='' >
					<CanCall action='PROJECTS_ADD_TASK' id='addUserBtn'>
						<Button.Ripple className='btn-icon' color='primary' onClick={this._openModal}>
							<Plus size={14} />
							<span className='ml-25'>{trans('gen.actions.add')}</span>
						</Button.Ripple>
					</CanCall>
				</Breadcrumbs>
				<Row>
					<Col sm='12'>
						<DataTable ref={(ref) => { this.dataTableRef = ref }} uri={`tasks/byProject/${this.props.projectId}`} columns={tableColumns(this.state, this._editModal, this._delete, hasAction)} hasIndexing={true} hasFilter={true}/>
					</Col>
				</Row>
				{basicInfoModalShow && <BasicInfoModal
					successCallback={() => {
						this.dataTableRef._refresh()
						this.props.onSuccessCallback()
					}} data={basicInfoModalData} onClose={this._closeModal}/>}
			</Fragment>
		)
	}
}
//************************************//
const mapStateToProps = store => ({
	loading: store.app.loading,
	userId: _.get(store, `${process.env.REACT_APP_AUTH_MODULE}.userData.id`)
})
export default connect(mapStateToProps, null, null, { forwardRef: true })(TasksList)
