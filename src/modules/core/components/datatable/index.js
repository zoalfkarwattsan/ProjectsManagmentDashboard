import React, {Fragment, Component, forwardRef} from 'react'
import { connect } from 'react-redux'
import ReactPaginate from 'react-paginate'
import {ChevronDown, FileText, MoreVertical, Trash} from 'react-feather'
import {default as DataTableBasic} from 'react-data-table-component'
import {Card, CardHeader, CardBody, CardTitle, Input, Button, Label, Row, Col, Spinner, Container} from 'reactstrap'
import _ from "lodash"
//************************************//
import '@styles/react/libs/tables/react-dataTable-component.scss'
import {trans} from '@utils'
//************************************//
import FilterForm from "./FilterForm"
import {_getList} from "../../redux/actions/app"
//************************************//
const columns = (cols, state) => {
  const columns = []
  if (state.hasIndexing) {
    columns.push({
      name: '#',
      cell: (row, index) => ((state.page - 1) * state.limit) + index + 1,
      grow: 0,
      minWidth: '75px'
    })
  }
  _.map(cols, (c, k) => {
    if (c.translatable) {
      _.forEach(state.langArr, (lang, langK) => {
        if (state.langArr.includes(lang)) {
          const tc = {...c}
          tc.name = (<span>{tc.name}<small className='text-lowercase text-muted'>{trans(`gen.lang.${lang}`)}</small></span>)
          tc.selector = `${tc.selector}.${lang}`
          columns.push(tc)
        }
      })
    } else {
      columns.push(c)
    }
  })
  return columns
}
//************************************//
class DataTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      total: 1,
      limit:  this.props.showAll ? 100000 : 10,
      page:1,
      totalPages: 1,
      filter: {},
      order: [],
      hasFilter: props.hasFilter ? props.hasFilter : false,
      langArr: props.langArr,
      hasIndexing: props.hasIndexing
    }

    this._refresh = this._refresh.bind(this)
  }
  //************************************//
  componentDidMount () {
    this._fetchData()
  }
  //************************************//
  columns = _.map(this.props.columns, (column) => {
      return  {
        name:column.selector ?? "",
        data:column.selector ?? "",
        searchable:false,
        orderable:column.sortable ?? false
      }
    })
  //************************************//
  _fetchData = (params = {}) => {
    _getList(
      {
        ...this.state,
        ...params,
        columns: this.columns,
        start: ((params.page ?? this.state.page) - 1) * (params.limit ?? this.state.limit),
        length: params.limit ?? this.state.limit,
        uri: this.props.uri
      },
      (data) => {
        this.setState({
          data: data.list,
          total: data.pagination.total,
          limit: data.pagination.limit,
          page: data.pagination.current_page,
          totalPages: data.pagination.total_pages
        })
    })
  }
  //************************************//
  _refresh = () => {
    this._fetchData({})
  }
  //************************************//
  _handlePagination = page => {
    this._fetchData({page: page.selected + 1})
  }
  //************************************//
  // ** Function to handle per page
  _handlePerPage = e => {
    this._fetchData({limit: parseInt(e.target.value)})
  }
  //************************************//
  _onSort = (column, sortDirection) => {
    this.setState({order: [{column:_.replace(_.findIndex(this.props.columns, x => x.selector === column.selector), '.', '->'), dir: sortDirection}]}, this._fetchData)
  }
  //************************************//
  _onFilter = (filter) => {
    this.setState({
      filter,
      page:1
    }, this._fetchData)
    if (this.props.refreshSelected === false || this.props.refreshSelected === true) {
      this.props.forceRefreshSelected()
    }
  }
  //************************************//
  CustomPagination = () => {
    const {page, totalPages, total, limit} = {...this.state}

    return (
      <Container>
        {!this.props.showAll && <Row>
          <Col>
            <div className='d-flex align-items-center my-1 '>
              <Label className='px-1' for='sort-select'>{trans('gen.datatable.show')}</Label>
              <Input
                  className='dataTable-select'
                  type='select'
                  id='sort-select'
                  bsSize='sm'
                  value={this.state.limit}
                  onChange={e => this._handlePerPage(e)}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={75}>75</option>
                <option value={100}>100</option>
                <option value={1000}>1000</option>
                <option value={10000}>10000</option>
              </Input>
              <Label className='my-1 px-1' >
                {trans('gen.datatable.totalRowsInfo', {
                  from: ((page - 1) * limit) + 1,
                  to: ((page - 1) * limit) + ((parseInt(limit) > total) ? total : (parseInt(limit))),
                  total
                })
                }
              </Label>
            </div>
          </Col>
          <Col>
            <ReactPaginate
                previousLabel={''}
                nextLabel={''}
                breakLabel='...'
                pageCount={totalPages || 1}
                marginPagesDisplayed={2}
                pageRangeDisplayed={2}
                activeClassName='active'
                forcePage={page !== 0 ? page - 1 : 0}
                onPageChange={page => this._handlePagination(page)}
                pageClassName={'page-item'}
                nextLinkClassName={'page-link'}
                nextClassName={'page-item next'}
                previousClassName={'page-item prev'}
                previousLinkClassName={'page-link'}
                pageLinkClassName={'page-link'}
                breakClassName='page-item'
                breakLinkClassName='page-link'
                containerClassName={
                  'pagination react-paginate pagination-sm justify-content-end pr-1 mt-1'
                }
            />
          </Col>
        </Row>}
      </Container>
    )
  }
  //************************************//
  render () {

    // ** Bootstrap Checkbox Component
    const BootstrapCheckbox = forwardRef(({ onClick, ...rest }, ref) => (
      <div className='custom-control custom-checkbox'>
        <input type='checkbox' className='custom-control-input' ref={ref} {...rest} />
        <label className='custom-control-label' onClick={onClick} />
      </div>
    ))

    return (
      <Fragment>
        {this.state.hasFilter && <FilterForm columns={this.props.columns} onFilter={this._onFilter} defaultCollapse={this.props.defaultCollapse}/>}
        <Card>
          <DataTableBasic
            noHeader
            striped
            pagination
            paginationServer
            sortServer
            onSort={this._onSort}
            disabled={this.props.loading}
            noDataComponent=""
            className='react-dataTable'
            columns={columns(this.props.columns, this.state)}
            sortIcon={<ChevronDown size={10} />}
            paginationComponent={this.CustomPagination}
            data={this.state.data}
            onSelectedRowsChange={this.props.onSelectedChange}
            selectableRows={!!this.props.hasSelectedRow}
            clearSelectedRows={this.props.refreshSelected !== false}
            selectableRowsComponent={this.props.hasSelectedRow ? BootstrapCheckbox : null}
          />
          {_.size(this.state.data) === 0 && this.props.loading &&
            <div className={'w-100 d-flex justify-content-center my-5'}>
              <Spinner className='mr-25' style={{ height: '3rem', width: '3rem' }} />
            </div>
          }
          {_.size(this.state.data) === 0 && !this.props.loading &&
            <div className={'w-100 d-flex justify-content-center my-5'}>
              No Data Found
            </div>
          }
        </Card>
      </Fragment>

    )
  }
}
//************************************//
const mapStateToProps = store => ({
  loading: store.app.loading,
  langArr: store.app.settings.app.langs
})
export default connect(mapStateToProps, null, null, {forwardRef: true})(DataTable)
