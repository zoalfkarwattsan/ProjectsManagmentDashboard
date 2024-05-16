import { Fragment, useState, useEffect } from 'react'
import { Row, Col, Button } from 'reactstrap'
import {Tab} from 'react-bootstrap'
import {useParams} from "react-router-dom"
import {useSelector} from "react-redux"
import _ from 'lodash'

import '@styles/react/pages/page-profile.scss'
import '../../../assets/scss/style.css'

import {_getCitizen} from "../../../redux/actions"
import ProfileDataTab from "./ProfileDataTab"
import ProjectsList from "./ProjectsList"
import ProfileHeader from './ProfileHeader'
import ElectionsList from "./ElectionsList"

const ResponsibleProfile = () => {
	const loading = useSelector(state => state.app.loading)
	const [data, setData] = useState({})
	const {id} = useParams()

	useEffect(() => {
		_getCitizen(id, (data) => setData(data))
	}, [])

	return (
		<Tab.Container unmountOnExit={true} mountOnEnter={true} defaultActiveKey="profileData">
			<div id='user-profile'>
				<Row>
					<Col sm='12'>
						<ProfileHeader data={data} />
					</Col>
				</Row>
			</div>
			{!_.isEmpty(data) &&
				<Tab.Content>
					<Tab.Pane eventKey="profileData">
						<ProfileDataTab data={data} />
					</Tab.Pane>
					<Tab.Pane eventKey="projects">
						<ProjectsList data={data} />
					</Tab.Pane>
					<Tab.Pane eventKey="elections">
						<ElectionsList data={data} />
					</Tab.Pane>
				</Tab.Content>
			}
		</Tab.Container>
	)
}

export default ResponsibleProfile
