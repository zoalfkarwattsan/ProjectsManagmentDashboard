import React, { Fragment, Component, memo } from 'react'
import { connect } from 'react-redux'
import {FileText, MoreVertical, Send, Plus, Key, User, Trash, Eye, Airplay, RefreshCw} from 'react-feather'
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
import BasicInfoModal from './BasicInfoModal'
import CanCall from "../../../components/CanCall"
import {_activateElection, _deActivateElection, _deleteElection, _resetElection} from "../../../redux/actions"
//************************************//
const tableColumns = (state, _editBasicInfoModal, _deleteUser, _activateElection, _deActivateElection, _reset, hasAction) => [
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
              <CanCall action='ELECTIONS_VIEW_ELECTION' id={`viewUser_${row.id}`}>
                <Link to={`/elections/${row.id}`} className='w-100 dropdown-item' >
                  <Eye size={15} />
                  <span className='align-middle ml-50'>{trans('gen.actions.view')}</span>
                </Link>
              </CanCall>
              {!row.active ? <>
                <CanCall action='ELECTIONS_EDIT_ELECTION' id={`updateUser_${row.id}`}>
                  <DropdownItem className='w-100' onClick={e => _editBasicInfoModal(row)}>
                    <FileText size={15} />
                    <span className='align-middle ml-50'>{trans('gen.actions.edit')}</span>
                  </DropdownItem>
                </CanCall>
                <CanCall action='ELECTIONS_DELETE_ELECTION' id={`deleteUser_${row.id}`}>
                  <DropdownItem className='w-100 btn-flat-danger' onClick={e => _deleteUser(row.id)}>
                    <Trash size={15}/>
                    <span className='align-middle ml-50'>{trans('gen.actions.delete')}</span>
                  </DropdownItem>
                </CanCall>
                <CanCall action='ELECTIONS_ACTIVATE_ELECTION' id={`activateElection-${row.id}`}>
                  <DropdownItem className='w-100 btn-flat-success' onClick={e => _activateElection(row.id)}>
                    <Airplay size={15}/>
                    <span className='align-middle ml-50'>{trans('user.actions.activate')}</span>
                  </DropdownItem>
                </CanCall>
                <CanCall action='ELECTIONS_RESET_ELECTION' id={`reset_${row.id}`}>
                  <DropdownItem className='w-100 btn-flat-danger' onClick={e => _reset(row.id)}>
                    <RefreshCw size={15}/>
                    <span className='align-middle ml-50'>{trans('user.actions.reset')}</span>
                  </DropdownItem>
                </CanCall>
                </> : <CanCall action='ELECTIONS_ACTIVATE_ELECTION' id={`activateElection-${row.id}`}>
                  <DropdownItem className='w-100 btn-flat-danger' onClick={e => _deActivateElection(row.id)}>
                    <Airplay size={15}/>
                    <span className='align-middle ml-50'>{trans('user.actions.deactivate')}</span>
                  </DropdownItem>
                </CanCall>
              }
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      )
    }
  }
]
const tableActions = ['ELECTIONS_VIEW_ELECTION', 'ELECTIONS_EDIT_ELECTION', 'ELECTIONS_DELETE_ELECTION', 'ELECTIONS_RESET_ELECTION', 'ELECTIONS_ACTIVATE_ELECTION']
//************************************//
class ElectionsList extends Component {
  static contextType = AbilityContext
  constructor(props) {
    super(props)
    this.state = {
      userId: props.userId,
      basicInfoModal: {basicInfoModalShow: false, basicInfoModalData: {}}
    }
    // this._editBasicInfoModal = this._editBasicInfoModal.bind(this)
    // this._delete = this._delete.bind(this)
    // this._activate = this._activate.bind(this)
    // this._deActivate = this._deActivate.bind(this)
    // this._reset = this._reset.bind(this)
  }
  //************************************//
   _closeBasicInfoModal = () => {
    this.setState({basicInfoModal: {basicInfoModalShow: false, basicInfoModalData: {}}})
  }
  //************************************//
  _openBasicInfoModal = () => {
    this.setState({basicInfoModal: {basicInfoModalShow: true, basicInfoModalData: {}}})
  }
  //************************************//
  _editBasicInfoModal = (data) => {
    this.setState({basicInfoModal: {basicInfoModalShow: true, basicInfoModalData: data}})
  }
  //************************************//
  _delete = (id) => {
    _confirm({
      callback: (c) => {
        _deleteElection(id, () => {
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
        _activateElection(id, () => {
          this.dataTableRef._refresh()
          c()
        })
      }
    })
  }
  //************************************//
  _deActivate = (id) => {
    _confirm({
      callback: (c) => {
        _deActivateElection(id, () => {
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
        _resetElection(id, () => {
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
        <Breadcrumbs breadCrumbMainTitle={''} breadCrumbTitle={''} breadCrumbParent='' breadCrumbActive='' >
          <CanCall action='ELECTIONS_ADD_ELECTION' id='addUserBtn'>
            <Button.Ripple className='btn-icon' color='primary' onClick={this._openBasicInfoModal}>
              <Plus size={14} />
              <span className='ml-25'>{trans('gen.actions.add')}</span>
            </Button.Ripple>
          </CanCall>
        </Breadcrumbs>
        <Row>
          <Col id={'election-table'} sm='12'>
            <DataTable ref={(ref) => { this.dataTableRef = ref }} uri={'elections'} columns={tableColumns(this.state, this._editBasicInfoModal, this._delete, this._activate, this._deActivate, this._reset, hasAction)} hasIndexing={true} hasFilter={true}/>
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
export default connect(mapStateToProps, null, null, { forwardRef: true })(ElectionsList)
