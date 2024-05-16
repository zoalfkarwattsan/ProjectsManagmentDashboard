import React from 'react'
import PropTypes from 'prop-types'
import _ from "lodash"
import {FormFeedback, Label} from "reactstrap"
// import { ErrorMessage } from '@hookform/error-message'

export const ErrorMessages = (props) => {
	const {valErrors = {}, errors = {}, name} = props
	return (
		<>
			{Object.keys(valErrors).length && _.get(props, `valErrors.${name}`) ? (
				<small className='text-danger'>{_.get(props, `valErrors.${name}`)}</small>
			) : null}
			<small className='text-danger'>{_.get(errors, `${name}.message`)}</small>
			{/*<ErrorMessage*/}
			{/*	errors={errors}*/}
			{/*	name={'name'}*/}
			{/*/>*/}
		</>
	)
}
