import React from "react"
import { Nav} from 'react-bootstrap'
import { User, Lock } from 'react-feather'
import {trans} from '@utils'

import CanCall from "../../components/CanCall"

const Tabs = () => {
  return (
    <Nav variant="pills" className="flex-column nav-left">

      {/*<CanCall action='SETTINGS_VIEW_STATUSES'>*/}
      {/*  <Nav.Item>*/}
      {/*    <Nav.Link eventKey="statuses">*/}
      {/*      <span className='font-weight-bold'>{trans('user.status.statuses')}</span>*/}
      {/*    </Nav.Link>*/}
      {/*  </Nav.Item>*/}
      {/*</CanCall>*/}

      {/*<CanCall action='SETTINGS_VIEW_PARTIES'>*/}
      {/*  <Nav.Item>*/}
      {/*    <Nav.Link eventKey="parties">*/}
      {/*      <span className='font-weight-bold'>{trans('user.parties')}</span>*/}
      {/*    </Nav.Link>*/}
      {/*  </Nav.Item>*/}
      {/*</CanCall>*/}

      <CanCall action='SETTINGS_VIEW_ANNOUNCEMENTS'>
        <Nav.Item>
          <Nav.Link eventKey="announcements">
            <span className='font-weight-bold'>{trans('user.announcements')}</span>
          </Nav.Link>
        </Nav.Item>
      </CanCall>

      <CanCall action='SETTINGS_VIEW_PROJECTTYPES'>
        <Nav.Item>
          <Nav.Link eventKey="projectTypes">
            <span className='font-weight-bold'>{trans('user.projectTypes')}</span>
          </Nav.Link>
        </Nav.Item>
      </CanCall>

    </Nav>
  )
}

export default Tabs
