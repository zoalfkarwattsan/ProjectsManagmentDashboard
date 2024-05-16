import React, { Fragment, Component, memo } from 'react'
import { connect } from 'react-redux'
import {FileText, MoreVertical, CheckCircle, XCircle, Key, User, Trash, Eye} from 'react-feather'
import {
  Row,
  Col,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap'
import { Link } from 'react-router-dom'
//************************************//
import Breadcrumbs from '@src/components/breadcrumbs'
import DataTable from '@src/components/datatable'
import {trans, _confirm, _url} from '@utils'
import {AbilityContext, _hasAnyAbility } from '@src/utility/context/Can'
import Avatar from '@components/avatar'
//************************************//
import {_getAllPersonalReligionsWithQ, _getAllRecordReligionsWithQ, _getAllUsersMunicipalitiesWithQ} from '../../../../redux/actions'
import CanCall from '../../../../components/CanCall'
import {Genders} from "../../../../utility/Constants"
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
    // omit: !hasAction,
    omit: true,
    cell: (row, index, column, id) => {
      return (
        <div className='d-flex'>
          <UncontrolledDropdown>
            <DropdownToggle className='pr-1' tag='span'>
              <MoreVertical size={15} />
            </DropdownToggle>
            <DropdownMenu right>
              <CanCall action='CITIZENS_VIEW_CITIZEN' id={`viewUser_${row.id}`}>
                <Link to={`/citizens/${row.id}`} className='w-100 dropdown-item' >
                  <Eye size={15} />
                  <span className='align-middle ml-50'>{trans('gen.actions.view')}</span>
                </Link>
              </CanCall>
              <CanCall action='CITIZENS_EDIT_CITIZEN' id={`updateUser_${row.id}`}>
                <DropdownItem  className='w-100' onClick={e => _editBasicInfoModal(row)}>
                  <FileText size={15} />
                  <span className='align-middle ml-50'>{trans('gen.actions.edit')}</span>
                </DropdownItem>
              </CanCall>
              <CanCall action='CITIZENS_DELETE_CITIZEN' id={`deleteUser_${row.id}`}>
                <DropdownItem className='w-100 btn-flat-danger' onClick={e => _deleteUser(row.id)}>
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
const tableActions = ['CITIZENS_VIEW_CITIZEN', 'CITIZENS_EDIT_CITIZEN', 'CITIZENS_DELETE_CITIZEN']
//************************************//
class CitizensProjects extends Component {
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
  render () {
    const hasAction = _hasAnyAbility(this.context, tableActions)
    return (
      <Fragment>
        <Breadcrumbs breadCrumbMainTitle={''} breadCrumbTitle={trans('user.nav.citizens')} breadCrumbParent='' breadCrumbActive='' >
        </Breadcrumbs>
        <Row>
          <Col sm='12'>
            <DataTable ref={(ref) => { this.dataTableRef = ref }} uri={`box/${this.props.boxId}/citizens/list`} columns={tableColumns(this.state, hasAction)} hasIndexing={true} hasFilter={true}/>
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
export default connect(mapStateToProps, null, null, { forwardRef: true })(CitizensProjects)
