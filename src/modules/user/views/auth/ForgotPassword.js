import React, {useState, useContext } from 'react'
import { useSelector } from 'react-redux'
import {useForm} from "react-hook-form"
import classnames from "classnames"
import { ChevronLeft } from 'react-feather'
import {Link, Redirect, useHistory} from 'react-router-dom'
import { Row, Col, CardTitle, CardText, Form, FormGroup, Label, Input, Button } from 'reactstrap'
import {isEmpty} from 'lodash'
//************************************//
import '@styles/base/pages/page-auth.scss'
import {trans} from '@utils'
import {isUserLoggedIn} from '../../utility/Utils'
import themeConfig from '@configs/themeConfig'
import { useSkin } from '@hooks/useSkin'
//************************************//
import {ButtonSpinner} from '@src/components'
//************************************//
import {_forgetPassword} from '../../redux/actions'
//************************************//
const ForgotPassword = () => {
  const loading = useSelector(state => state.app.loading)

  const [skin, setSkin] = useSkin()
  const history = useHistory()
  const [email, setEmail] = useState('')
  const { register, errors, setValue, handleSubmit, trigger } = useForm()
  register('register-email', { required: true, validate: value => value !== '' })
  const [valErrors, setValErrors] = useState({})

  const  source = skin === 'dark' ? themeConfig.app.images.forgetPasswordDark : themeConfig.app.images.forgetPassword


  const onSubmit = () => {
    if (!isEmpty(errors)) {
      return
    }
    setValErrors({})
    _forgetPassword(
        {email},
        (d) => {

          history.push('/login')
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

  const handleEmailChange = e => {
    const errs = valErrors
    if (errs.email) delete errs.email
    setEmail(e.target.value)
    setValErrors(errs)
    setValue('register-email', e.target.value)
  }

  if (!isUserLoggedIn()) {
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
              <img className='img-fluid' src={source} alt='Login V2' />
            </div>
          </Col>
          <Col className='d-flex align-items-center auth-bg px-2 p-lg-5' lg='4' sm='12'>
            <Col className='px-xl-2 mx-auto' sm='8' md='6' lg='12'>
              <CardTitle tag='h2' className='font-weight-bold mb-1'>
                {trans('user.forgetPassword')} 🔒
              </CardTitle>
              <CardText className='mb-2'>
                {trans('user.resetPasswordInstructions')}
              </CardText>
              <Form action='/' className='auth-register-form mt-2' onSubmit={handleSubmit(onSubmit)}>
                <FormGroup>
                  <Label className='form-label' for='register-email'>
                    {trans('user.email')}
                  </Label>
                  <Input
                      type='email'
                      value={email}
                      id='register-email'
                      name='register-email'
                      onChange={handleEmailChange}
                      placeholder='john@example.com'
                      className={classnames({ 'is-invalid': errors['register-email'] })}
                  />
                  {Object.keys(valErrors).length && valErrors.email ? (
                      <small className='text-danger'>{valErrors.email}</small>
                  ) : null}
                </FormGroup>
                <Button.Ripple type='submit' block color='primary' disabled={loading}>
                  { loading ? <ButtonSpinner/> : null}
                  <span>{trans('gen.actions.send')}</span>
                </Button.Ripple>
              </Form>
              <p className='text-center mt-2'>
                <Link to='/login'>
                  <ChevronLeft className='mr-25' size={14} />
                  <span className='align-middle'>{trans('user.backToLogin')}</span>
                </Link>
              </p>
            </Col>
          </Col>
        </Row>
      </div>
    )
  } else {
    return <Redirect to='/' />
  }
}

export default ForgotPassword
