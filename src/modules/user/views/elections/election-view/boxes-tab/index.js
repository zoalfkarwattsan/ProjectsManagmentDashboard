import React, {Fragment, useContext} from 'react'
import PropTypes from 'prop-types'
import {Card, CardBody, CardHeader, CardText, CardTitle, Col, Row, Label, FormGroup} from "reactstrap"
import {Briefcase, CheckSquare} from "react-feather"
import {useParams} from "react-router-dom"

import StatsVertical from '@components/widgets/stats/StatsVertical'
import {trans} from '@utils'
import {useTrans} from '@hooks/useTrans'
import BoxesList from "./boxes-list"

const BoxesTab = (props) => {
	const {id} = useParams()

	return (
		<Fragment>
			<BoxesList electionId={id} />
		</Fragment>
	)
}

BoxesTab.propTypes = {

}

export default BoxesTab
