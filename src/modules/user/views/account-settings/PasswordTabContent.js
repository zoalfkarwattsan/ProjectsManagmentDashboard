import React, {useContext, useState} from "react"
import {useForm, Controller} from "react-hook-form"
import {useSelector } from 'react-redux'
import classnames from "classnames"
import {Row, Col, Form, FormGroup, Label, Button, FormFeedback} from 'reactstrap'
import InputPasswordToggle from '@components/input-password-toggle'
import {isEmpty} from 'lodash'
//************************************//
import {trans} from '@utils'
//************************************//
import {ButtonSpinner} from '@src/components'
//************************************//
import {_changePassword} from '../../redux/actions'
import {yupResolver} from "@hookform/resolvers/yup"
import * as yup from "yup"

const PasswordTabContent = () => {

  const loading = useSelector(state => state.app.loading)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [valErrors, setValErrors] = useState({})

  const ValidationSchema = yup.object().shape({
    current_password: yup.string().required(),
    new_password: yup.string().min(6).required(),
    confirm_password: yup.string().oneOf([yup.ref('new_password'), null], trans('user.validation.password_match'))
  })

  const defaultValues = {
    current_password : '',
    new_password: '',
    confirm_password:''
  }

  const { register, handleSubmit, control, setValue, errors, trigger} = useForm({ mode: 'onSubmit', resolver: yupResolver(ValidationSchema), defaultValues })


  const onSubmit = (data, e) => {
    if (!isEmpty(errors)) {
      return
    }
    setValErrors({})
    _changePassword(
      {...data},
      (res) => {
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
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
    <Form action='/' onSubmit={handleSubmit(onSubmit)}>
      <Row>
        <Col sm='6'>
          <FormGroup>
            <div className='d-flex justify-content-between'>
              <Label className='form-label' for='current_password'>
                {trans('user.currentPassword')}
              </Label>
            </div>
            <InputPasswordToggle
              id='current_password'
              name='current_password'
              className='input-group-merge'
              className={classnames({ 'is-invalid': errors['current_password'] })}
              innerRef={register({ required: true, validate: value => value !== '' })}
              autoFocus
            />
            {Object.keys(valErrors).length && valErrors.current_password ? (
              <small className='text-danger'>{valErrors.current_password}</small>
            ) : null}
            {errors && errors.current_password && <FormFeedback>{errors.current_password.message}</FormFeedback>}
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col sm='6'>
          <FormGroup>
            <div className='d-flex justify-content-between'>
              <Label className='form-label' for='new_password'>
                {trans('user.newPassword')}
              </Label>
            </div>
            <InputPasswordToggle
              id='new_password'
              name='new_password'
              className='input-group-merge'
              className={classnames({ 'is-invalid': errors['new_password'] })}
              innerRef={register({ required: true, validate: value => value !== '' })}
            />
            {Object.keys(valErrors).length && valErrors.new_password ? (
              <small className='text-danger'>{valErrors.new_password}</small>
            ) : null}
            {errors && errors.new_password && <FormFeedback>{errors.new_password.message}</FormFeedback>}
          </FormGroup>
        </Col>
        <Col sm='6'>
          <FormGroup>
            <div className='d-flex justify-content-between'>
              <Label className='form-label' for='confirm_password'>
                {trans('user.confirmPassword')}
              </Label>
            </div>
            <InputPasswordToggle
              id='confirm_password'
              name='confirm_password'
              className='input-group-merge'
              className={classnames({ 'is-invalid': errors['confirm_password'] })}
              innerRef={register({ required: true, validate: value => value !== '' && value === newPassword })}
            />
            {errors && errors.confirm_password && <FormFeedback>{errors.confirm_password.message}</FormFeedback>}
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col sm='3'>
          <Button.Ripple type='submit' block color='primary' disabled={loading}>
            { loading ? <ButtonSpinner/> : null}
            <span>{trans('gen.actions.save')}</span>
          </Button.Ripple>
        </Col>
      </Row>

    </Form>
  )
}

export default PasswordTabContent
