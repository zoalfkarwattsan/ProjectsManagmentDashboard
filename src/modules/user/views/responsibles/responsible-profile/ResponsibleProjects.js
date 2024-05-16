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
  DropdownItem, Badge
} from 'reactstrap'
import { Link } from 'react-router-dom'
//************************************//
import Breadcrumbs from '@src/components/breadcrumbs'
import DataTable from '@src/components/datatable'
import {trans, _confirm, _url} from '@utils'
import {AbilityContext, _hasAnyAbility } from '@src/utility/context/Can'
import Avatar from '@components/avatar'
import AvatarGroup from '@components/avatar-group'
//************************************//
import {_deleteResponsible} from '../../../redux/actions'
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
    name: trans('user.name'),
    selector: 'name',
    sortable: false,
    filter: {
      enabled: false
    }
  },
  {
    name: trans('user.startDate'),
    selector: 'start_date',
    sortable: false,
    cell: (row, index, column, id) => {
      return <Badge color='light-info'>{row.start_date}</Badge>
    },
    filter: {
      enabled: false
    }
  },
  {
    name: trans('user.dueDate'),
    selector: 'due_date',
    sortable: false,
    cell: (row, index, column, id) => {
      return <Badge color='light-danger'>{row.due_date}</Badge>
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
      return <AvatarGroup data={_.map(row.responsibles, (x) => { return {title: `${x.fname} ${x.mname} ${x.lname}`, img: _url(x.image)} })} />
    },
    filter: {
      enabled: false
    }
  },
  {
    name: trans('user.citizen'),
    selector: 'user',
    sortable: false,
    cell: (row, index, column, id) => {
      return <Badge pill color='light-secondary'>{row.user ? `${row.user?.fname} ${row.user?.mname} ${row.user?.lname}` : ''}</Badge>
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
      return <Badge pill color={row.status.icon_color}>{row.status.name}</Badge>
    },
    filter: {
      enabled: false
    }
  },
  {
    name: trans('user.type'),
    selector: 'type',
    sortable: false,
    cell: (row, index, column, id) => {
      return <Badge pill color={row.project_type.icon_color}>{row.project_type.name}</Badge>
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
              <CanCall action='PROJECTS_VIEW_PROJECT' id={`viewUser_${row.id}`}>
                <Link to={`/projects/${row.id}`} className='w-100 dropdown-item' >
                  <Eye size={15} />
                  <span className='align-middle ml-50'>{trans('gen.actions.view')}</span>
                </Link>
              </CanCall>
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      )
    }
  }
]
const tableActions = ['PROJECTS_VIEW_PROJECT']
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
        <Breadcrumbs breadCrumbMainTitle={''} breadCrumbTitle={trans('user.profile.projects')} breadCrumbParent='' breadCrumbActive='' >
        </Breadcrumbs>
        <Row>
          <Col sm='12'>
            <DataTable ref={(ref) => { this.dataTableRef = ref }} uri={`project/indexByResponsible/${this.props.data.id}`} columns={tableColumns(this.state, hasAction)} hasIndexing={true} hasFilter={false}/>
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
