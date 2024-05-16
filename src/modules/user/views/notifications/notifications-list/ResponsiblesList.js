import React, { Fragment, Component } from 'react'
import { connect } from 'react-redux'
import {
  Row,
  Col,
  Badge
} from 'reactstrap'
//************************************//
import DataTable from '@src/components/datatable'
import {trans, _confirm, _url} from '@utils'
import {AbilityContext, _hasAnyAbility } from '@src/utility/context/Can'
import Avatar from '@components/avatar'
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
    sortable: false,
    minWidth: '225px',
    omit: true,
    filter: {
      enabled: true,
      type: 'text'
    }
  },
  {
    name: trans('user.mname'),
    selector: 'mname',
    sortable: false,
    minWidth: '225px',
    omit: true,
    filter: {
      enabled: true,
      type: 'text'
    }
  },
  {
    name: trans('user.lname'),
    selector: 'lname',
    sortable: false,
    minWidth: '225px',
    omit: true,
    filter: {
      enabled: true,
      type: 'text'
    }
  },
  {
    sortable: false,
    maxWidth: '25px',
    filter: {
      enabled: false
    },
    cell: (row, index, column, id) => {
      return _url(row.image).length > 0 ? <Avatar img={_url(row.image)} imgHeight='25' imgWidth='25' /> : null
    }
  },
  {
    name: trans('user.name'),
    selector: 'name',
    sortable: false,
    // minWidth: '225px',
    filter: {
      enabled: false
    }
  },
  {
    name: trans('user.mobile'),
    selector: 'phone',
    sortable: true,
    // minWidth: '250px',
    filter: {
      enabled: false
    }
  },
  {
    name: trans('user.email'),
    selector: 'email',
    sortable: true,
    // minWidth: '250px',
    filter: {
      enabled: false
    }
  },
  {
    name: trans('user.type'),
    selector: 'type',
    sortable: false,
    cell: (row, index, column, id) => {
      return row.responsible_type_id === 1 ? <Badge color='primary'>{row.type}</Badge> : row.responsible_type_id === 2 ? <Badge color='success'>{row.type}</Badge> : <Badge color='info'>{row.type}</Badge>
    },
    filter: {
      enabled: true,
      type: 'select',
      options: state.types
    }
  }
]
const tableActions = ['']
//************************************//
class UserList extends Component {
  static contextType = AbilityContext
  constructor(props) {
    super(props)
    this.state = {
      userId: props.userId,
      types: [{label: trans('user.projectManager'), value: 1}, {label: trans('user.delegate'), value: 2}, {label: trans('user.responsible'), value: 3}]
    }

  }
  //************************************//
  render () {
    const hasAction = _hasAnyAbility(this.context, tableActions)
    return (
      <Fragment>
        <Row>
          <Col sm='12'>
            <DataTable ref={(ref) => { this.dataTableRef = ref }} uri={'responsibles?has_fcm=1'} columns={tableColumns(this.state, hasAction)} hasIndexing={false} hasFilter={true} hasSelectedRow={true} onSelectedChange={this.props.onSelectedRows}/>
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
export default connect(mapStateToProps, null, null, { forwardRef: true })(UserList)
