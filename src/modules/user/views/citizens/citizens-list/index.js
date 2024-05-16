import React, {Fragment, Component} from 'react'
import { connect } from 'react-redux'
import {FileText, MoreVertical, Send, Plus, Key, User, Trash, Eye} from 'react-feather'
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
import {
  _deleteCitizen,
  _getAllPersonalReligionsWithQ,
  _getAllRecordReligionsWithQ,
  _getAllUsersMunicipalitiesWithQ
} from '../../../redux/actions'
import CanCall from '../../../components/CanCall'
import {Genders} from "../../../utility/Constants"
import BasicInfoModal from "./BasicInfoModal"
//************************************//
const tableColumns = (state, _editBasicInfoModal, _deleteUser, hasAction) => [
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
              <CanCall action='CITIZENS_VIEW_CITIZEN' id={`viewUser_${row.id}`}>
                <Link to={`/citizens/${row.id}`} className='w-100 dropdown-item' >
                  <Eye size={15} />
                  <span className='align-middle ml-50'>{trans('gen.actions.view')}</span>
                </Link>
              </CanCall>
              {row.created_by_id &&
                <>
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
                </>
              }
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      )
    }
  }
]
const tableActions = ['CITIZENS_VIEW_CITIZEN', 'CITIZENS_EDIT_CITIZEN', 'CITIZENS_DELETE_CITIZEN']
//************************************//
class ResponsibleProjects extends Component {
  static contextType = AbilityContext
  constructor(props) {
    super(props)
    this.state = {
      userId: props.userId,
      basicInfoModal: {basicInfoModalShow: false, basicInfoModalData: {}}
    }
    this._editBasicInfoModal = this._editBasicInfoModal.bind(this)
  }
  //************************************//
  _openBasicInfoModal = () => {
    this.setState({basicInfoModal: {basicInfoModalShow: true, basicInfoModalData: {types: this.state.types}}})
  }
  //************************************//
  _closeBasicInfoModal = () => {
    this.setState({basicInfoModal: {basicInfoModalShow: false, basicInfoModalData: {}}})
  }
  //************************************//
  _editBasicInfoModal = (data) => {
    this.setState({basicInfoModal: {basicInfoModalShow: true, basicInfoModalData: data}})
  }
  //************************************//
  _delete = (id) => {
    _confirm({
      callback: (c) => {
        _deleteCitizen(id, () => {
          this.dataTableRef._refresh()
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
        <Breadcrumbs breadCrumbMainTitle={''} breadCrumbTitle={trans('user.nav.citizens')} breadCrumbParent='' breadCrumbActive='' >
          <CanCall action='CITIZENS_ADD_CITIZEN' id='addUserBtn'>
            <Button.Ripple className='btn-icon' color='primary' onClick={this._openBasicInfoModal}>
              <Plus size={14} />
              <span className='ml-25'>{trans('gen.actions.add')}</span>
            </Button.Ripple>
          </CanCall>
        </Breadcrumbs>
        <Row>
          <Col sm='12'>
            <DataTable ref={(ref) => { this.dataTableRef = ref }} uri={`users`} columns={tableColumns(this.state, this._editBasicInfoModal, this._delete, hasAction)} hasIndexing={true} hasFilter={true}/>
          </Col>
        </Row>
        {basicInfoModalShow && <BasicInfoModal  successCallback={this.dataTableRef._refresh} data={basicInfoModalData} onClose={this._closeBasicInfoModal}/>}
      </Fragment>
    )
  }
}
//************************************//
const mapStateToProps = store => ({
  loading: store.app.loading,
  userId: _.get(store, `${process.env.REACT_APP_AUTH_MODULE}.userData.id`)
})
export default connect(mapStateToProps, null, null, { forwardRef: true })(ResponsibleProjects)
