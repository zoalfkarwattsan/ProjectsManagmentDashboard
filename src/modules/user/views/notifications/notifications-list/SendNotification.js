import React, {Fragment, useState} from 'react'
import PropTypes from 'prop-types'
import {Button, Card, CardBody, Col, FormGroup, Input, Label, Row, Form } from "reactstrap"
import {Controller, useForm} from "react-hook-form"
import {useSelector} from "react-redux"
import _ from "lodash"
import classnames from "classnames"

import {trans} from '@utils'

import {ButtonSpinner, ErrorMessages} from '@src/components'

import {_sendPushNotification} from "../../../redux/actions"
import ResponsiblesList from "./ResponsiblesList"

const SendNotification = props => {
	const loading = useSelector(state => state.app.loading)
	const { errors, handleSubmit, control, getValues, trigger, register, unregister, setValue, value } = useForm()
	const [valErrors, setValErrors] = useState({})
	const [selectedResponsibles, setSelectedResponsibles] = useState({})

	const onSubmit = async () => {
		const data = getValues()
		const cond = await trigger()
		if (!cond) {
			return
		}
		data.responsibles = _.map(selectedResponsibles.selectedRows, x => x.fcm_token)
		setValErrors({})
		_sendPushNotification(
			data,
			() => {},
			(err) => {
				if (err) {
					const arr = {}
					for (const f in err) {
						if (err[f] !== null) arr[f] = err[f][0]
					}
					setValErrors(arr)
				}
			}
		)
	}

	return (
		<Fragment>
			<Row>
				<Col>
					<Card>
						<CardBody>
							<Form action='/' className='flex-grow-1 d-flex flex-column' onSubmit={handleSubmit(onSubmit)}>
								<Row>
									<Col xs={6}>
										<FormGroup>
											<Label className='form-label' for='title'>
												{trans('user.title')}
											</Label>
											<Controller
												as={Input}
												control={control}
												type='text'
												id='title'
												name='title'
												rules={{
													required: trans('user.validation.required')
												}}
												defaultValue={''}
												className={classnames({ 'is-invalid': errors['title'] || _.get(valErrors, 'title')})}
											/>
											<ErrorMessages valErrors={valErrors} errors={errors} name={'title'} />
										</FormGroup>
									</Col>
									<Col xs={6}>
										<FormGroup>
											<Label className='form-label' for='body'>
												{trans('user.body')}
											</Label>
											<Controller
												as={Input}
												control={control}
												type='text'
												id='body'
												name='body'
												rules={{
													required: trans('user.validation.required')
												}}
												defaultValue={''}
												className={classnames({ 'is-invalid': errors['body'] || _.get(valErrors, 'body')})}
											/>
											<ErrorMessages valErrors={valErrors} errors={errors} name={'body'} />
										</FormGroup>
									</Col>
								</Row>
								<Row className={'justify-content-center'}>
									<Col xs={4}>
										<Button.Ripple type='submit' className='btn-block' color='primary' disabled={loading}>
											{ loading ? <ButtonSpinner/> : null}
											<span>{trans('user.send')}</span>
										</Button.Ripple>
									</Col>
								</Row>
							</Form>
						</CardBody>
					</Card>
				</Col>
			</Row>
			<ResponsiblesList onSelectedRows={setSelectedResponsibles} />
		</Fragment>
	)
}

SendNotification.propTypes = {

}

export default SendNotification
