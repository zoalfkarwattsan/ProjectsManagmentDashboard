import React, { Fragment, Component, memo } from 'react'
import { connect } from 'react-redux'
import {FileText, MoreVertical, Send, Plus, Key, User, Trash, Eye, Airplay, CheckCircle, XCircle} from 'react-feather'
import {
	Row,
	Col,
	Button,
	UncontrolledDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem, Badge
} from 'reactstrap'
import {Link} from "react-router-dom"
//************************************//
import Breadcrumbs from '@src/components/breadcrumbs'
import DataTable from '@src/components/datatable'
import {trans, _confirm} from '@utils'
import {AbilityContext, _hasAnyAbility } from '@src/utility/context/Can'
//************************************//
//************************************//
const tableColumns = (state, _editBasicInfoModal, _deleteUser, _activateElection, hasAction) => [
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
		name: trans('user.year'),
		selector: 'year',
		sortable: true,
		cell: (row, index, column, id) => {
			return <Badge color={`light-${row.active ? 'success' : 'primary'}`}>{row.year}</Badge>
		},
		filter: {
			enabled: true,
			type: 'text'
		}
	},
	{
		name: trans('user.electionDate'),
		selector: 'election_date',
		sortable: true,
		cell: (row, index, column, id) => {
			return <Badge color='light-info'>{row.election_date}</Badge>
		},
		filter: {
			enabled: true,
			type: 'text'
		}
	},
	{
		name: trans('user.color'),
		selector: 'color',
		sortable: true,
		cell: (row, index, column, id) => {
			const election = JSON.parse(row.user)
			return !_.isEmpty(election) && election.pivot.color
		}
	},
	{
		name: trans('user.arrived'),
		selector: 'arrived',
		sortable: false,
		cell: (row, index, column, id) => {
			const election = JSON.parse(row.user)
			return _.get(election, 'pivot.arrived') ? <CheckCircle color={'#0ea400'} size={21} /> : null
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
		sortable: true,
		cell: (row, index, column, id) => {
			const election = JSON.parse(row.user)
			return _.get(election, 'pivot.voted') ? <CheckCircle color={'#0ea400'} size={21} /> : <XCircle color={'#ff0000'} size={21} />
		},
		filter: {
			enabled: true,
			type: 'select',
			options: [{label:trans('user.voted'), value: 1}, {label: trans('user.notVoted'), value: 0}]
		}
	}
]
const tableActions = ['']
//************************************//
class ElectionsList extends Component {
	static contextType = AbilityContext
	constructor(props) {
		super(props)
		this.state = {
			userId: props.userId
		}
	}
	//************************************//
	render () {
		const hasAction = _hasAnyAbility(this.context, tableActions)
		return (
			<Fragment>
				<Breadcrumbs breadCrumbMainTitle={''} breadCrumbTitle={trans('user.profile.elections')} breadCrumbParent='' breadCrumbActive='' >
				</Breadcrumbs>
				<Row>
					<Col sm='12'>
						<DataTable ref={(ref) => { this.dataTableRef = ref }} uri={`election/user/${this.props.data.id}/prevElections/list`} columns={tableColumns(this.state, this._editBasicInfoModal, this._deleteUser, this._activateElection, hasAction)} hasIndexing={true} hasFilter={true}/>
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
export default connect(mapStateToProps, null, null, { forwardRef: true })(ElectionsList)
