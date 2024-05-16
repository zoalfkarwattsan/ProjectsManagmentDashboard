import React, {Fragment, Component, memo} from 'react'
import {connect} from 'react-redux'
import {FileText, MoreVertical, Send, Plus, Key, User, Trash} from 'react-feather'
import {
    Row,
    Col,
    Button,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem, Badge
} from 'reactstrap'
import {Link} from 'react-router-dom'
//************************************//
import Breadcrumbs from '@src/components/breadcrumbs'
import DataTable from '@src/components/datatable'
import {trans, _confirm, _url} from '@utils'
import {AbilityContext, _hasAnyAbility} from '@src/utility/context/Can'
import AvatarGroup from '@components/avatar-group'
//************************************//
import CanCall from '../../../components/CanCall'
import BasicInfoModal from "./BasicInfoModal"
import {_deleteProject, _getAllProjectTypesWithQ, _getAllStatusesWithQ} from "../../../redux/actions"
import _ from "lodash"
//************************************//
const tableColumns = (state, setState, _edit, _delete, hasAction) => [
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
        minWidth: "200px",
        filter: {
            enabled: true,
            type: 'text'
        }
    },
    {
        name: trans('user.startDate'),
        selector: 'start_date',
        sortable: false,
        cell: (row, index, column, id) => {
            return row.start_date && <Badge color='light-info'>{row.start_date}</Badge>
        },
        filter: {
            enabled: false,
            type: 'date'
        }
    },
    {
        name: trans('user.dueDate'),
        selector: 'due_date',
        sortable: false,
        cell: (row, index, column, id) => {
            return row.due_date && <Badge color='light-danger'>{row.due_date}</Badge>
        },
        filter: {
            enabled: false,
            type: 'date'
        }
    },
    {
        name: trans('user.projectManagers'),
        selector: 'responsibles',
        sortable: false,
        cell: (row, index, column, id) => {
            return <AvatarGroup data={_.map(row.responsibles, (x) => {
                return {title: `${x.fname.replaceAll('.', '')} ${x.lname.replaceAll('.', '')}`, img: _url(x.image)}
            })}/>
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
            return row.user ? <Link to={`/citizens/${_.get(row, 'user.id')}`} className='w-100'>
                <Badge pill
                       color='light-secondary'>{_.get(row, 'user.fname')} {_.get(row, 'user.mname')} {_.get(row, 'user.lname')}</Badge>
            </Link> : null
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
            return <Badge pill color={_.get(row, 'status.icon_color')}>{_.get(row, 'status.name')}</Badge>
        },
        filter: {
            enabled: true,
            type: 'asyncSelect',
            isMulti: true,
            loadOptions: _getAllStatusesWithQ
        }
    },
    {
        name: trans('user.projectType'),
        selector: 'type',
        sortable: false,
        cell: (row, index, column, id) => {
            return <Badge pill color={_.get(row, 'project_type.icon_color')}>{_.get(row, 'project_type.name')}</Badge>
        },
        filter: {
            enabled: true,
            type: 'asyncSelect',
            isMulti: false,
            loadOptions: _getAllProjectTypesWithQ
        }
    },
    {
        name: trans('user.fromDate'),
        selector: 'from_date',
        omit: true,
        filter: {
            enabled: true,
            type: 'date'
        }
    },
    {
        name: trans('user.toDate'),
        selector: 'to_date',
        omit: true,
        filter: {
            enabled: true,
            type: 'date'
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
                            <MoreVertical size={15}/>
                        </DropdownToggle>
                        <DropdownMenu right>
                            <CanCall action='PROJECTS_VIEW_PROJECT' id={`viewUser_${row.id}`}>
                                <Link to={`/projects/${row.id}`} className='w-100 dropdown-item'>
                                    <User size={15}/>
                                    <span className='align-middle ml-50'>{trans('gen.actions.view')}</span>
                                </Link>
                            </CanCall>
                            <CanCall action='PROJECTS_EDIT_PROJECT' id={`updateUser_${row.id}`}>
                                <DropdownItem className='w-100' onClick={e => _edit(row)}>
                                    <FileText size={15}/>
                                    <span className='align-middle ml-50'>{trans('gen.actions.edit')}</span>
                                </DropdownItem>
                            </CanCall>
                            <CanCall action='PROJECTS_DELETE_PROJECT' id={`deleteUser_${row.id}`}>
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
const tableActions = ['PROJECTS_VIEW_PROJECT', 'PROJECTS_EDIT_PROJECT', 'PROJECTS_DELETE_PROJECT']

//************************************//
class ProjectsList extends Component {
    static contextType = AbilityContext

    constructor(props) {
        super(props)
        this.state = {
            userId: props.userId,
            basicInfoModal: {basicInfoModalShow: false, basicInfoModalData: {}},
            start_date: '',
            due_date: ''
        }
        this._editModal = this._editModal.bind(this)
    }

    //************************************//
    _closeModal = () => {
        this.setState({basicInfoModal: {basicInfoModalShow: false, basicInfoModalData: {}}})
    }
    //************************************//
    _openModal = () => {
        this.setState({basicInfoModal: {basicInfoModalShow: true, basicInfoModalData: {}}})
    }
    //************************************//
    _editModal = (data) => {
        this.setState({basicInfoModal: {basicInfoModalShow: true, basicInfoModalData: data}})
    }
    //************************************//
    _delete = (id) => {
        _confirm({
            callback: (c) => {
                _deleteProject(id, () => {
                    this.dataTableRef._refresh()
                    c()
                })
            }
        })
    }

    //************************************//
    render() {
        const {basicInfoModalShow, basicInfoModalData} = this.state.basicInfoModal
        const hasAction = _hasAnyAbility(this.context, tableActions)
        return (
            <Fragment>
                <Breadcrumbs breadCrumbMainTitle={''} breadCrumbTitle={trans('user.nav.projects')} breadCrumbParent=''
                             breadCrumbActive=''>
                    <CanCall action='PROJECTS_ADD_PROJECT' id='addUserBtn'>
                        <Button.Ripple className='btn-icon' color='primary' onClick={this._openModal}>
                            <Plus size={14}/>
                            <span className='ml-25'>{trans('gen.actions.add')}</span>
                        </Button.Ripple>
                    </CanCall>
                </Breadcrumbs>
                <Row>
                    <Col sm='12'>
                        <DataTable ref={(ref) => {
                            this.dataTableRef = ref
                        }} uri={`projects`}
                                   columns={tableColumns(this.state, this.setState, this._editModal, this._delete, hasAction)}
                                   hasIndexing={true} hasFilter={true}/>
                    </Col>
                </Row>
                {basicInfoModalShow &&
                    <BasicInfoModal successCallback={this.dataTableRef._refresh} data={basicInfoModalData}
                                    onClose={this._closeModal}/>}
            </Fragment>
        )
    }
}

//************************************//
const mapStateToProps = store => ({
	loading: store.app.loading,
	userId: _.get(store, `${process.env.REACT_APP_AUTH_MODULE}.userData.id`)
})
export default connect(mapStateToProps, null, null, {forwardRef: true})(ProjectsList)
