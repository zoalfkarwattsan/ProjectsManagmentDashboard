import React, { Fragment, Component, memo } from 'react'
import { connect } from 'react-redux'
import {FileText, MoreVertical, Send, Plus, Key, User, Trash, Eye} from 'react-feather'
import {
  Row,
  Col
} from 'reactstrap'
import { Link } from 'react-router-dom'
//************************************//
import Breadcrumbs from '@src/components/breadcrumbs'
import DataTable from '@src/components/datatable'
import {trans} from '@utils'
import {AbilityContext, _hasAnyAbility } from '@src/utility/context/Can'
//************************************//
import {_getAllAdminsWithQ} from '../../../redux/actions'
import CanCall from '../../../components/CanCall'
//************************************//
const tableColumns = (state, hasAction) => [
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
    name: trans('user.title'),
    selector: 'title',
    sortable: true,
    filter: {
      enabled: true,
      type: "text"
    }
  },
  {
    name: trans('user.body'),
    selector: 'body',
    sortable: true,
    minWidth: '200px',
    filter: {
      enabled: true,
      type: "text"
    }
  },
  {
    name: trans('user.createdAt'),
    selector: 'created_at',
    sortable: true,
    filter: {
      enabled: false,
      type: "text"
    }
  },
  {
    name: trans('user.createdBy'),
    selector: 'created_by',
    sortable: true,
    filter: {
      enabled: true,
      type: "asyncSelect",
      isMulti: true,
      loadOptions: _getAllAdminsWithQ
    }
  }
]
const tableActions = ['']
//************************************//
class ResponsibleProjects extends Component {
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
        <Breadcrumbs breadCrumbMainTitle={''} breadCrumbTitle={trans('user.nav.notifications')} breadCrumbParent='' breadCrumbActive='' >
          <CanCall action='NOTIFICATIONS_SEND_NOTIFICATION' id='addUserBtn'>
            <Link to={`/notifications/send`} className='btn btn-primary' >
              <span className='align-middle ml-50'>{trans('gen.actions.add')}</span>
            </Link>
          </CanCall>
        </Breadcrumbs>
        <Row>
          <Col sm='12'>
            <DataTable ref={(ref) => { this.dataTableRef = ref }} uri={`notifications`} columns={tableColumns(this.state, hasAction)} hasIndexing={true} hasFilter={true}/>
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
export default connect(mapStateToProps, null, null, { forwardRef: true })(ResponsibleProjects)
