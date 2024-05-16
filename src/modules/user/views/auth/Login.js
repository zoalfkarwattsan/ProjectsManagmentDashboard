import React, { useState, useContext, Fragment } from 'react'
import classnames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { Link, useHistory } from 'react-router-dom'
import {
  Row,
  Col,
  CardTitle,
  CardText,
  Form,
  Input,
  FormGroup,
  Label,
  CustomInput,
  Button
} from 'reactstrap'
import InputPasswordToggle from '@components/input-password-toggle'
import {isEmpty} from 'lodash'
//************************************//
import {ButtonSpinner} from '@src/components'
import { AbilityContext } from '@src/utility/context/Can'
import themeConfig from '@configs/themeConfig'
import '@styles/base/pages/page-auth.scss'
import { _setAPIToken} from '../../utility/Utils'
import { trans} from '@utils'
import { useSkin } from '@hooks/useSkin'
//************************************//
import {_getMyProfile, _login} from '../../redux/actions'
import TwoFactorModal from '../../components/TwoFactorModal'
//************************************//
const Login = props => {
  const [skin, setSkin] = useSkin()
  const ability = useContext(AbilityContext)
  const dispatch = useDispatch()
  const history = useHistory()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [twoFactorModal, setTwoFactorModal] = useState({twoFactorModalShow: false, twoFactorModalData: {}})
  const loading = useSelector(state => state.app.loading)

  const { register, errors, setValue, handleSubmit } = useForm()
  register('login-email', { required: true, validate: value => value !== '' })
  register('login-password', { required: true, validate: value => value !== '' })
  const source = skin === 'dark' ? themeConfig.app.images.loginDark : themeConfig.app.images.login

  const _loginSuccessCallback = (res) => {
    if (res.data.token) {
      const {data} = res
      dispatch({type:"USER_LOGIN", userData:data.user, token:data.token})
      _setAPIToken(data.token)
      sessionStorage.setItem("USER_TOKEN", JSON.stringify({email, token: data.token, user: data.user}))
      if (rememberMe) {
        localStorage.setItem("USER_TOKEN", JSON.stringify({email, token: data.token}))
      }
      if (data.user.abilities) {
        ability.update(data.user.abilities)
      }
      history.push('/')
    } else if (res.next_step_code === 'USR_CHANGE_PASSWORD') {
      history.push(`/reset-password/${email}`)
    } else if (res.next_step_code === 'USR_2FA') {
      setTwoFactorModal({twoFactorModalShow: true, twoFactorModalData: res.data})
    }
  }
  const onSubmit = data => {
    if (isEmpty(errors)) {
      _login(
          {email, password},
          (res) => {
            _loginSuccessCallback(res)
          },
          () => {
          }
      )
    }
  }
  const _closeTwoFactorModal = () => {
    setTwoFactorModal({twoFactorModalShow: false, twoFactorModalData: {}})
  }

  const {twoFactorModalShow, twoFactorModalData} = twoFactorModal

  return (
    <div className='auth-wrapper auth-v2'>
      <Row className='auth-inner m-0'>
        <Link className='brand-logo' to='/' onClick={e => e.preventDefault()}>
          <span className='login-logo'>
            <img src={themeConfig.app.appLogoImage} alt='logo' />
          </span>
          <h2 className='brand-text text-primary ml-1'>{themeConfig.app.appName}</h2>
        </Link>
        <Col className='d-none d-lg-flex align-items-center p-5' lg='8' sm='12'>
          <div className='w-100 d-lg-flex align-items-center justify-content-center px-5'>
            <img className='img-fluid' src={source} alt={trans('user.login')} />
          </div>
        </Col>
        <Col className='d-flex align-items-center auth-bg px-2 p-lg-5' lg='4' sm='12'>
          <Col className='px-xl-2 mx-auto' sm='8' md='6' lg='12'>
            <CardTitle tag='h3' className='font-weight-bold mb-1'>
              {trans('user.welcomeTo', {name:themeConfig.app.appName})}! 👋
            </CardTitle>
            <CardText className='mb-2'>
              {trans('user.loginHelpText')}
            </CardText>

            <Form className='auth-login-form mt-2' onSubmit={handleSubmit(onSubmit)}>
              <FormGroup>
                <Label className='form-label' for='login-email'>
                  {trans('user.email')}
                </Label>
                <Input
                  autoFocus
                  type='email'
                  value={email}
                  id='login-email'
                  name='login-email'
                  placeholder='john@example.com'
                  htmlFor={'login-password'}
                  onChange={e => {
                    setEmail(e.target.value)
                    setValue('login-email', e.target.value)
                  }}
                  className={classnames({ 'is-invalid': errors['login-email'] })}
                />
              </FormGroup>
              <FormGroup>
                <Label className='form-label' for='login-password'>
                  {trans('user.password')}
                </Label>
                <InputPasswordToggle
                  value={password}
                  id='login-password'
                  name='login-password'
                  onChange={e => {
                    setPassword(e.target.value)
                    setValue('login-password', e.target.value)
                  }}
                  className={classnames('input-group-merge', { 'is-invalid': errors['login-password'] })}
                />
              </FormGroup>
              <FormGroup>
                <div className='d-flex justify-content-between'>
                  <CustomInput type='checkbox' className='custom-control-Primary' id='remember-me' label={trans('user.rememberMe')} onChange={e => setRememberMe(e.target.checked)}/>
                  {/*<Link to='/forgot-password'>*/}
                  {/*  <small>{trans('user.forgetPassword')}</small>*/}
                  {/*</Link>*/}
                </div>
              </FormGroup>
              <Button.Ripple type='submit' color='primary' block disabled={loading}>
                { loading ? <ButtonSpinner/> : null}
                <span>{trans('user.login')}</span>
              </Button.Ripple>
            </Form>
            {/*<p className='text-center mt-2'>*/}
            {/*  <span className='mr-25'>{trans('user.newOnPlatform')}</span>*/}
            {/*  <Link to='/register'>*/}
            {/*    <span>{trans('user.createAccount')}</span>*/}
            {/*  </Link>*/}
            {/*</p>*/}
          </Col>
        </Col>
      </Row>
      {twoFactorModalShow && <TwoFactorModal email={email} successCallback={_loginSuccessCallback} data={twoFactorModalData} onClose={_closeTwoFactorModal}/>}
    </div>
  )
}

export default Login
