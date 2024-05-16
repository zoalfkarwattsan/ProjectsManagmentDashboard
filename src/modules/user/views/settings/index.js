import React, {Fragment, useEffect, useState} from 'react'
import { Card, CardBody, CardTitle, CardHeader} from 'reactstrap'
import {Tab, Row, Col} from 'react-bootstrap'

import {trans} from '@utils'
import Breadcrumbs from '@src/components/breadcrumbs'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/pages/page-account-settings.scss'


import Tabs from './Tabs'
import StatusesList from "./statuses-list"
import PartiesList from "./parties-list"
import AnnouncementsList from "./announcements-list"
import ProjectTypesList from "./project-types-list"

const Settings = () => {
  return (
    <Fragment>
      <Breadcrumbs breadCrumbMainTitle='' breadCrumbTitle={trans('user.nav.settings')} breadCrumbParent='Pages' breadCrumbActive='Account Settings'/>
      <Tab.Container unmountOnExit={true} mountOnEnter={true} defaultActiveKey="projectTypes">
        <Row>
          <Col className='mb-2 mb-md-0' sm={3}>
            <Tabs />
          </Col>
          <Col sm={9}>
            <Tab.Content>
              {/*<Tab.Pane eventKey="statuses">*/}
              {/*  <Card>*/}
              {/*    <CardHeader>*/}
              {/*      <CardTitle tag='h4'>{trans(`user.status.statuses`)}</CardTitle>*/}
              {/*    </CardHeader>*/}
              {/*    <CardBody>*/}
              {/*      <StatusesList/>*/}
              {/*    </CardBody>*/}
              {/*  </Card>*/}
              {/*</Tab.Pane>*/}
              {/*<Tab.Pane eventKey="parties">*/}
              {/*  <Card>*/}
              {/*    <CardHeader>*/}
              {/*      <CardTitle tag='h4'>{trans(`user.parties`)}</CardTitle>*/}
              {/*    </CardHeader>*/}
              {/*    <CardBody>*/}
              {/*      <PartiesList/>*/}
              {/*    </CardBody>*/}
              {/*  </Card>*/}
              {/*</Tab.Pane>*/}
              {/*<Tab.Pane eventKey="announcements">*/}
              {/*  <Card>*/}
              {/*    <CardHeader>*/}
              {/*      <CardTitle tag='h4'>{trans(`user.announcements`)}</CardTitle>*/}
              {/*    </CardHeader>*/}
              {/*    <CardBody>*/}
              {/*      <AnnouncementsList/>*/}
              {/*    </CardBody>*/}
              {/*  </Card>*/}
              {/*</Tab.Pane>*/}
              <Tab.Pane eventKey="projectTypes">
                <Card>
                  <CardHeader>
                    <CardTitle tag='h4'>{trans(`user.projectTypes`)}</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <ProjectTypesList/>
                  </CardBody>
                </Card>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Fragment>
  )
}

export default Settings
