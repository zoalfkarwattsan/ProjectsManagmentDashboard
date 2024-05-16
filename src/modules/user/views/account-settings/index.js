import React, {Fragment, useEffect, useState} from 'react'
import { Card, CardBody, CardTitle, CardHeader} from 'reactstrap'
import {Tab, Row, Col} from 'react-bootstrap'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/pages/page-account-settings.scss'
import Breadcrumbs from '@src/components/breadcrumbs'

import {trans} from '@utils'


import Tabs from './Tabs'
import BasicTabContent from './BasicTabContent'
import GeneralTabContent from './GeneralTabContent'
import PasswordTabContent from './PasswordTabContent'
import {_getMyProfile} from "../../redux/actions"
import {useDispatch} from "react-redux"

const AccountSettings = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    _getMyProfile(dispatch)
  }, [])


  return (
    <Fragment>
      <Breadcrumbs breadCrumbMainTitle='User Management' breadCrumbTitle='Account Settings' breadCrumbParent='Pages' breadCrumbActive='Account Settings'/>
      <Tab.Container unmountOnExit={true} mountOnEnter={true} defaultActiveKey="basicInfo">
        <Row>
          <Col className='mb-2 mb-md-0' md='3'>
            <Tabs />
          </Col>
          <Col sm={9}>
            <Tab.Content>
              <Tab.Pane eventKey="basicInfo">
                <Card>
                  <CardHeader>
                    <CardTitle tag='h4'>{trans(`user.accountSettings.basicInfo`)}</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <BasicTabContent/>
                  </CardBody>
                </Card>
              </Tab.Pane>
              <Tab.Pane eventKey="generalInfo">
                <Card>
                  <CardHeader>
                    <CardTitle tag='h4'>{trans(`user.accountSettings.generalInfo`)}</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <GeneralTabContent/>
                  </CardBody>
                </Card>
              </Tab.Pane>
              <Tab.Pane eventKey="changePassword">
                <Card>
                  <CardHeader>
                    <CardTitle tag='h4'>{trans(`user.accountSettings.changePassword`)}</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <PasswordTabContent />
                  </CardBody>
                </Card>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
      {/*<Row>*/}
      {/*  <Col className='mb-2 mb-md-0' md='3'>*/}
      {/*    <Tabs activeTab={activeTab} toggleTab={toggleTab} />*/}
      {/*  </Col>*/}
      {/*  <Col md='9'>*/}
      {/*    <Card>*/}
      {/*      <CardHeader>*/}
      {/*        <CardTitle tag='h4'>{trans(`user.accountSettings.${activeTab}`)}</CardTitle>*/}
      {/*      </CardHeader>*/}
      {/*      <CardBody>*/}
      {/*        <TabContent activeTab={activeTab}>*/}
      {/*          {activeTab === 'basicInfo' &&*/}
      {/*          <TabPane tabId='basicInfo'>*/}
      {/*            <BasicTabContent />*/}
      {/*          </TabPane>}*/}
      {/*          {activeTab === 'generalInfo' &&*/}
      {/*          <TabPane tabId='generalInfo'>*/}
      {/*            <GeneralTabContent />*/}
      {/*          </TabPane>}*/}
      {/*          {activeTab === 'changePassword' &&*/}
      {/*          <TabPane tabId='changePassword'>*/}
      {/*            <PasswordTabContent />*/}
      {/*          </TabPane>}*/}
      {/*        </TabContent>*/}
      {/*      </CardBody>*/}
      {/*    </Card>*/}
      {/*  </Col>*/}
      {/*</Row>*/}
    </Fragment>
  )
}

export default AccountSettings
