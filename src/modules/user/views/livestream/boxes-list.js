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
import {_getAllDelegatesWithQ, _getAllUsersMunicipalitiesWithQ} from "../../redux/actions"
//************************************//
const tableColumns = (state, hasAction) => [
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
	render () {
		const hasAction = _hasAnyAbility(this.context, tableActions)
		return (
			<Fragment>
				<Breadcrumbs breadCrumbMainTitle={trans('user.nav.liveStream')} breadCrumbTitle={trans('user.boxes')} breadCrumbParent='' breadCrumbActive='' />
				<Row>
					<Col sm='12'>
						<DataTable ref={(ref) => { this.dataTableRef = ref }} uri={`election/active/boxes`} columns={tableColumns(this.state, hasAction)} hasIndexing={true} hasFilter={true}/>
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
export default connect(mapStateToProps, null, null, { forwardRef: true })(BoxesList)
