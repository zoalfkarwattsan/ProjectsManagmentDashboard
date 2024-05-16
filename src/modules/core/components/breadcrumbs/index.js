// ** React Imports
import { Link } from 'react-router-dom'

// ** Third Party Components
import Proptypes from 'prop-types'
import { Breadcrumb, BreadcrumbItem} from 'reactstrap'

const BreadCrumbs = props => {
  // ** Props
  const { breadCrumbMainTitle, breadCrumbTitle, children} = props

  return (
    <div className='content-header row'>
      <div className='content-header-left col-md-9 col-12 mb-2'>
        <div className='row breadcrumbs-top'>
          <div className='col-12'>
            {breadCrumbTitle ? <h2 className='content-header-title float-left mb-0 border-right-0'>{breadCrumbMainTitle ? <b>{breadCrumbMainTitle}: </b> : ''}{breadCrumbTitle}</h2> : ''}
          </div>
        </div>
      </div>
      <div className='content-header-right text-md-right col-md-3 col-12'>
        <div className='form-group breadcrum-right dropdown'>
          {children}
        </div>
      </div>
    </div>
  )
}
export default BreadCrumbs

// ** PropTypes
BreadCrumbs.propTypes = {
  breadCrumbTitle: Proptypes.any.isRequired,
  breadCrumbActive: Proptypes.string.isRequired
}
