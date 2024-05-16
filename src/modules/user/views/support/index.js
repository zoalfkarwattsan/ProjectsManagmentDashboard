import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {Button, Card, CardBody, CardText, Col, CustomInput, Form, FormGroup, Input, Row} from "reactstrap"
import _ from "lodash"
import {useForm} from "react-hook-form"
import classnames from "classnames"
import {useSelector} from "react-redux"

import {trans} from '@utils'
import {ButtonSpinner, ErrorMessages} from '@src/components'
import {_saveSupportEmail} from "../../redux/actions"
import themeConfig from '@configs/themeConfig'

const support = props => {
	const { errors, handleSubmit, control, register } = useForm()
	const [valErrors, setValErrors] = useState({})
	const loading = useSelector(state => state.app.loading)

	const onSubmit = (data) => {
		console.log(!_.isEmpty(errors))
		if (!_.isEmpty(errors)) {
			return
		}
		setValErrors({})
		_saveSupportEmail(
			data,
			() => {
			},
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
		<Row className={'justify-content-center align-items-center p-3'}>
			<Col sm='12' md="3"/>
			<Col sm='12' md="6" className={'d-flex justify-content-center align-items-center'}>
				<img width={225} height={150} className='mb-4'src={themeConfig.app.appLogoImage} />
			</Col>
			<Col sm='12' md="3"/>
			<Col sm='12' md="3"/>
			<Col sm='12' md="6">
				<Card>
					<CardText tag={'h1'} className={'text-center mt-2'}>
						Contact support
					</CardText>
					<CardBody>
						<p className={'mt-2'}>
							Please fill the form or contact us on
							<a href="mailto:info@arabunificationparty.com" className="hover-underline"> info@arabunificationparty.com</a>.
						</p>
						<Form className='form' onSubmit={handleSubmit(onSubmit)}>
							<Row>
								<Col sm='12'>
									<FormGroup className='mb-2'>
										<Input
											placeholder='Name'
											className={classnames({ 'is-invalid': errors['name'] || _.get(valErrors, 'name') })}
											name={'name'}
											innerRef={register({required: trans('user.validation.required')})}
										/>
									</FormGroup>
								</Col>
								<Col sm='12'>
									<FormGroup className='mb-2'>
										<Input
											type='email'
											placeholder='Email'
											className={classnames({ 'is-invalid': errors['email'] || _.get(valErrors, 'email') })}
											name={'email'}
											innerRef={register({required: trans('user.validation.required')})}
										/>
									</FormGroup>
								</Col>
								<Col sm='12'>
									<FormGroup className='mb-2'>
										<Input
											type='text'
											className={classnames({ 'is-invalid': errors['subject'] || _.get(valErrors, 'subject') })}
											placeholder='Subject'
											name={'subject'}
											innerRef={register({required: trans('user.validation.required')})}
										/>
									</FormGroup>
								</Col>
								<Col sm='12'>
									<FormGroup className='mb-2'>
										<Input
											type='textarea'
											className={classnames('mb-2', { 'is-invalid': errors['message'] || _.get(valErrors, 'message') })}
											rows='4'
											placeholder='Message'
											name={'message'}
											innerRef={register({required: trans('user.validation.required')})}
										/>
									</FormGroup>
								</Col>
								<Col sm='12'>
									<Button.Ripple type='submit' className='flex-grow-1' color='primary' disabled={loading}>
										{ loading ? <ButtonSpinner/> : null}
										<span>Send</span>
									</Button.Ripple>
									<div className={'d-flex justify-content-center align-items-center mt-3'}>
										<a href={'/dashboard'} >Dashboard</a>
										<span>,&nbsp;</span>
										<a href={'/privacy'} >Privacy policy</a>
									</div>
								</Col>
							</Row>
						</Form>
					</CardBody>
				</Card>
			</Col>
			<Col sm='12' md="3"/>
		</Row>
	)
}

support.propTypes = {

}

export default support
