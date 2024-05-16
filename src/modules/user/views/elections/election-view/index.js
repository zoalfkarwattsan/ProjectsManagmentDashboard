import React from 'react'
import {Row} from 'reactstrap'
import {Tab} from 'react-bootstrap'
import {useHistory, useParams} from "react-router-dom"

import '@styles/react/pages/page-profile.scss'
import {_getActiveTab} from '@utils'

import '../../../assets/scss/style.css'
import ElectionHeader from './ElectionHeader'
import CitizensTab from "./citizens-tab"
import BoxesTab from "./boxes-tab"
import PartiesTab from "./parties-tab"
import BoxesCloseRequestsList from "./boxes-close-requests-tab"

const ElectionView = () => {
	const history = useHistory()
	const {id} = useParams()

	return (
		<Tab.Container unmountOnExit={true} mountOnEnter={true} defaultActiveKey={_getActiveTab("citizens", ['citizens', 'boxes', 'parties', 'closeRequests'])} onSelect={(tabKey) => { history.push(`#${tabKey}`) }}>
			<Row>
				<ElectionHeader />
			</Row>
			<Tab.Content>
				<Tab.Pane eventKey="citizens">
					<CitizensTab />
				</Tab.Pane>
				<Tab.Pane eventKey="boxes">
					<BoxesTab />
				</Tab.Pane>
				<Tab.Pane eventKey="parties">
					<PartiesTab />
				</Tab.Pane>
				<Tab.Pane eventKey="closeRequests">
					<BoxesCloseRequestsList electionId={id} />
				</Tab.Pane>
			</Tab.Content>
		</Tab.Container>
	)
}

export default ElectionView
