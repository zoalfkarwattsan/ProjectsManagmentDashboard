import React from "react"
import { Nav} from 'react-bootstrap'
import { User, Lock } from 'react-feather'
import {trans} from '@utils'

const Tabs = () => {
  return (
    <Nav variant="pills" className="flex-column nav-left">
      <Nav.Item>
        <Nav.Link eventKey="basicInfo">
          <User size={18} className='mr-1'/>
          <span className='font-weight-bold'>{trans('user.accountSettings.basicInfo')}</span>
        </Nav.Link>
      </Nav.Item>

      <Nav.Item>
        <Nav.Link eventKey="generalInfo">
          <User size={18} className='mr-1'/>
          <span className='font-weight-bold'>{trans('user.accountSettings.generalInfo')}</span>
        </Nav.Link>
      </Nav.Item>

      <Nav.Item>
        <Nav.Link eventKey="changePassword">
          <Lock size={18} className='mr-1'/>
          <span className='font-weight-bold'>{trans('user.accountSettings.changePassword')}</span>
        </Nav.Link>
      </Nav.Item>
    </Nav>
  )
}

export default Tabs
