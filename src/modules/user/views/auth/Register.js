import React, { Fragment, useState, useContext } from 'react'
import classnames from 'classnames'
import { useForm } from 'react-hook-form'
import { Link, useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Row, Col, CardTitle, CardText, FormGroup, Label, Button, Form, Input, CustomInput } from 'reactstrap'
import {isEmpty} from 'lodash'
//************************************//
import {trans} from '@utils'
import '@styles/base/pages/page-auth.scss'
import themeConfig from '@configs/themeConfig'
import { useSkin } from '@hooks/useSkin'
import {ButtonSpinner} from '@src/components'
//************************************//
import {_register} from '../../redux/actions'
//************************************//
const Register = () => {
  const loading = useSelector(state => state.app.loading)

  const [skin, setSkin] = useSkin()
  const history = useHistory()
  const { register, errors, setValue, handleSubmit } = useForm()
  register('register-first-name', { required: true, validate: value => value !== '' })
  register('register-last-name', { required: true, validate: value => value !== '' })
  register('register-email', { required: true, validate: value => value !== '' })
  register('terms', { required: true, validate: value => value !== '' })

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [terms, setTerms] = useState(false)
  const [valErrors, setValErrors] = useState({})

  const  source = skin === 'dark' ? themeConfig.app.images.registerDark : themeConfig.app.images.register

  const Terms = () => {
    return (
      <Fragment>
        {trans('user.agree')}
        <a className='ml-25' href='/' onClick={e => e.preventDefault()}>
          {trans('user.privacyAndPolicy')}
        </a>
      </Fragment>
    )
  }

  const onSubmit = () => {
    if (!isEmpty(errors)) {
      return
    }
    setValErrors({})
    _register(
        {firstName, lastName, email, mobile},
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

  const handleFirstChange = e => {
    const errs = valErrors
    if (errs.firstName) delete errs.firstName
    setFirstName(e.target.value)
    setValErrors(errs)
    setValue('register-first-name', e.target.value)
  }

  const handleLastChange = e => {
    const errs = valErrors
    if (errs.lastName) delete errs.lastName
    setLastName(e.target.value)
    setValErrors(errs)
    setValue('register-last-name', e.target.value)
  }

  const handleEmailChange = e => {
    const errs = valErrors
    if (errs.email) delete errs.email
    setEmail(e.target.value)
    setValErrors(errs)
    setValue('register-email', e.target.value)
  }

  return (
    <div className='auth-wrapper auth-v2'>
      <Row className='auth-inner m-0'>
        <Link className='brand-logo' to='/' onClick={e => e.preventDefault()}>
          <span className='login-logo'>
            <img src={themeConfig.app.appLogoImage} alt={themeConfig.app.appName} />
          </span>
          <h2 className='brand-text text-primary ml-1'>{themeConfig.app.appName}</h2>
        </Link>
        <Col className='d-none d-lg-flex align-items-center p-5' lg='8' sm='12'>
          <div className='w-100 d-lg-flex align-items-center justify-content-center px-5'>
            <img className='img-fluid' src={source} alt={trans('user.register')} />
          </div>
        </Col>
        <Col className='d-flex align-items-center auth-bg px-2 p-lg-5' lg='4' sm='12'>
          <Col className='px-xl-2 mx-auto' sm='8' md='6' lg='12'>
            <CardTitle tag='h2' className='font-weight-bold mb-1'>
              {trans('user.registerTitle')} 🚀
            </CardTitle>
            <CardText className='mb-2'>{trans('user.registerHelpText')}</CardText>

            <Form action='/' className='auth-register-form mt-2' onSubmit={handleSubmit(onSubmit)}>
              <FormGroup>
                <Label className='form-label' for='register-first-name'>
                  {trans('user.firstName')}
                </Label>
                <Input
                  autoFocus
                  type='text'
                  value={firstName}
                  placeholder='John'
                  id='register-first-name'
                  name='register-first-name'
                  onChange={handleFirstChange}
                  className={classnames({ 'is-invalid': errors['register-first-name'] })}
                />
                {Object.keys(valErrors).length && valErrors.first_name ? (
                  <small className='text-danger'>{valErrors.first_name}</small>
                ) : null}
              </FormGroup>
              <FormGroup>
                <Label className='form-label' for='register-last-name'>
                  {trans('user.lastName')}
                </Label>
                <Input
                    type='text'
                    value={lastName}
                    placeholder='Smith'
                    id='register-last-name'
                    name='register-last-name'
                    onChange={handleLastChange}
                    className={classnames({ 'is-invalid': errors['register-last-name'] })}
                />
                {Object.keys(valErrors).length && valErrors.last_name ? (
                    <small className='text-danger'>{valErrors.last_name}</small>
                ) : null}
              </FormGroup>
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
              <FormGroup>
                <CustomInput
                  type='checkbox'
                  id='terms'
                  name='terms'
                  value='terms'
                  label={<Terms />}
                  className='custom-control-Primary'
                  onChange={e => {
                    setTerms(e.target.checked)
                    setValue('terms', e.target.checked)
                  }}
                  invalid={errors.terms && true}
                />
              </FormGroup>
              <Button.Ripple type='submit' block color='primary' disabled={loading}>
                { loading ? <ButtonSpinner/> : null}
                <span>{trans('user.register')}</span>
              </Button.Ripple>
            </Form>
            <p className='text-center mt-2'>
              <span className='mr-25'>{trans('user.alreadyUser')}</span>
              <Link to='/login'>
                <span>{trans('user.login')}</span>
              </Link>
            </p>
          </Col>
        </Col>
      </Row>
    </div>
  )
}

export default Register
