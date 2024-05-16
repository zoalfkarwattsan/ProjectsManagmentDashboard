import React, {useContext, useState} from "react"
import {useForm} from "react-hook-form"
import { useDispatch, useSelector } from 'react-redux'
import {Link, useHistory, useParams} from 'react-router-dom'
import { ChevronLeft } from 'react-feather'
import classnames from "classnames"
import { Card, CardBody, CardTitle, CardText, Form, FormGroup, Label, Button } from 'reactstrap'
import InputPasswordToggle from '@components/input-password-toggle'
import {isEmpty} from 'lodash'
//************************************//
import '@styles/base/pages/page-auth.scss'
import themeConfig from '@configs/themeConfig'
import { AbilityContext } from '@src/utility/context/Can'
import {trans, _setAPIToken} from '@utils'
//************************************//
import {ButtonSpinner} from '@src/components'
//************************************//
import {_resetPassword} from '../../redux/actions'
import TwoFactorModal from '../../components/TwoFactorModal'
//************************************//
const ResetPassword = () => {
  const paramsURL = useParams()
  const params = {
    email: paramsURL.email
  }
  //************************************//
  const loading = useSelector(state => state.app.loading)
  const ability = useContext(AbilityContext)
  const dispatch = useDispatch()
  const history = useHistory()
  const [email, setEmail] = useState(params.email)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const { register, errors, handleSubmit, trigger, getValues, setValue } = useForm()
  const [valErrors, setValErrors] = useState({})
  const [twoFactorModal, setTwoFactorModal] = useState({twoFactorModalShow: false, twoFactorModalData: {}})
  register('current-password', { required: true, validate: value => value !== '' })
  register('new-password', { required: true, validate: value => value !== '' })
  register('confirm-password', { required: true, validate: value => value !== '' && value === newPassword })
  //************************************//
  const _resetSuccessCallback = (res) => {
    if (res.data.token) {
      const {data} = res
      dispatch({type:"USER_LOGIN", userData:data.user, token:data.token})
      _setAPIToken(data.token)
      sessionStorage.setItem("USER_TOKEN", JSON.stringify({email, token: data.token, user: data.user}))
      if (data.user.abilities) {
        ability.update(data.user.abilities)
      }
      history.push('/')
    } else if (res.next_step_code === 'USR_2FA') {
      setTwoFactorModal({twoFactorModalShow: true, twoFactorModalData: res.data})
    }

  }
  //************************************//
  const onSubmit = data => {
    if (!isEmpty(errors)) {
      return
    }
    setValErrors({})
    _resetPassword(
        {email, currentPassword, newPassword},
        (res) => {
          _resetSuccessCallback(res)
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
  //************************************//
  const _closeTwoFactorModal = () => {
    setTwoFactorModal({twoFactorModalShow: false, twoFactorModalData: {}})
  }
  //************************************//
  const {twoFactorModalShow, twoFactorModalData} = twoFactorModal

  return (
    <div className='auth-wrapper auth-v1 px-2'>
      <div className='auth-inner py-2'>
        <Card className='mb-0'>
          <CardBody>
            <Link className='brand-logo' to='/' onClick={e => e.preventDefault()}>
              <span className='login-logo'>
                <img src={themeConfig.app.appLogoImage} alt='logo' />
              </span>
              <h2 className='brand-text text-primary ml-1'>{themeConfig.app.appName}</h2>
            </Link>
            <CardTitle tag='h4' className='mb-1'>
              {trans('user.resetPassword')} 🔒
            </CardTitle>
            <CardText className='mb-2'>{trans('user.resetPasswordHelpText')}</CardText>
            <Form className='auth-reset-password-form mt-2' action='/' onSubmit={handleSubmit(onSubmit)}>
              <FormGroup>
                <div className='d-flex justify-content-between'>
                  <Label className='form-label' for='current-password'>
                    {trans('user.currentPassword')}
                  </Label>
                </div>
                <InputPasswordToggle
                    value={currentPassword}
                    id='current-password'
                    name='current-password'
                    onChange={e => {
                      setCurrentPassword(e.target.value)
                      setValue('current-password', e.target.value)
                    }}
                    className={classnames('input-group-merge', { 'is-invalid': errors['current-password'] })}
                    autoFocus
                />
                {Object.keys(valErrors).length && valErrors.current_password ? (
                    <small className='text-danger'>{valErrors.current_password}</small>
                ) : null}
              </FormGroup>

              <FormGroup>
                <div className='d-flex justify-content-between'>
                  <Label className='form-label' for='new-password'>
                    {trans('user.newPassword')}
                  </Label>
                </div>
                <InputPasswordToggle
                    value={newPassword}
                    id='new-password'
                    name='new-password'
                    onChange={e => {
                      setNewPassword(e.target.value)
                      setValue('new-password', e.target.value)
                    }}
                    className={classnames('input-group-merge', { 'is-invalid': errors['new-password'] })}
                />
                {Object.keys(valErrors).length && valErrors.new_password ? (
                    <small className='text-danger'>{valErrors.new_password}</small>
                ) : null}
              </FormGroup>
              <FormGroup>
                <div className='d-flex justify-content-between'>
                  <Label className='form-label' for='confirm-password'>
                    {trans('user.confirmPassword')}
                  </Label>
                </div>
                <InputPasswordToggle
                    value={confirmPassword}
                    id='confirm-password'
                    name='confirm-password'
                    onChange={e => {
                      setConfirmPassword(e.target.value)
                      setValue('confirm-password', e.target.value)
                    }}
                    className={classnames('input-group-merge', { 'is-invalid': errors['confirm-password'] })}
                    {...register()}
                />
              </FormGroup>
              <Button.Ripple type='submit' block color='primary' disabled={loading}>
                { loading ? <ButtonSpinner/> : null}
                <span>{trans('user.setNewPassword')}</span>
              </Button.Ripple>
            </Form>
            <p className='text-center mt-2'>
              <Link to='/login'>
                <ChevronLeft className='mr-25' size={14} />
                <span className='align-middle'>{trans('user.backToLogin')}</span>
              </Link>
            </p>
          </CardBody>
        </Card>
      </div>
      {twoFactorModalShow && <TwoFactorModal email={email} successCallback={_resetSuccessCallback} data={twoFactorModalData} onClose={_closeTwoFactorModal}/>}
    </div>
  )
}

export default ResetPassword
