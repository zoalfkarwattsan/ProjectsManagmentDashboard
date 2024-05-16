import React, { Fragment, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import classnames from 'classnames'
import { useForm, Controller } from 'react-hook-form'
import {Button, Label, Row, Col, Input, FormGroup, Form, FormFeedback} from 'reactstrap'
import _, {isEmpty} from 'lodash'
//************************************//
import {trans} from '@utils'
import {ButtonSpinner} from '@src/components'
//************************************//
import {_changeBasicInfo} from "../../redux/actions"
import * as yup from "yup"
import {yupResolver} from "@hookform/resolvers/yup"
import {useTrans} from "@hooks/useTrans"
//************************************//
const BasicTab = ({ data }) => {
  const dispatch = useDispatch()
  const loading = useSelector(state => state.app.loading)
  const userData = useSelector(state => _.get(store, `${process.env.REACT_APP_AUTH_MODULE}.userData`))
  const [valErrors, setValErrors] = useState({})

  const ValidationSchema = yup.object().shape({
    first_name: yup.string().min(2).required(),
    last_name: yup.string().min(2).required()
  })

  const defaultValues = {
    first_name : '',
    last_name: ''
  }

  const { register, handleSubmit, control, setValue, errors, trigger} = useForm({ mode: 'onSubmit', resolver: yupResolver(ValidationSchema), defaultValues })

  useEffect(() => {
    if (userData.first_name || userData.last_name) {
      setValue('first_name', userData.first_name)
      setValue('last_name', userData.last_name)
    }
  }, [userData])

  const onSubmit = (data) => {
    if (!isEmpty(errors)) {
      return
    }
    setValErrors({})
    dispatch(
      _changeBasicInfo(
        data,
        (d) => {},
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
    )

  }

  return (
      <Form action='/' onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col sm='6'>
            <FormGroup>
              <Label for='email'>{useTrans('user.email')}</Label>
              <Input
                  disabled={true}
                  defaultValue={userData.email}
                  type='email'
                  id='email'
                  name='email'
                  placeholder={trans('user.email')}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col sm='6'>
            <FormGroup>
              <Label for='username'>{trans('user.firstName')}</Label>
              <Controller
                as={Input}
                control={control}
                defaultValue={userData.first_name}
                id='first_name'
                name='first_name'
                className={classnames({
                  'is-invalid': (!valErrors && !_.isEmpty(valErrors.first_name)) || (errors && !_.isEmpty(errors.first_name))
                })}
              />
              {Object.keys(valErrors).length && valErrors.first_name ? (
                <small className='text-danger'>{valErrors.first_name}</small>
              ) : null}
              {errors && errors.first_name && <FormFeedback>{errors.first_name.message}</FormFeedback>}
            </FormGroup>
          </Col>
          <Col sm='6'>
            <FormGroup>
              <Label for='username'>{trans('user.lastName')}</Label>
              <Controller
                as={Input}
                control={control}
                  defaultValue={userData.last_name}
                  id='last_name'
                  name='last_name'
                  className={classnames({
                    'is-invalid': (!valErrors && !_.isEmpty(valErrors.last_name)) || (errors && !_.isEmpty(errors.last_name))
                  })}
              />
              {Object.keys(valErrors).length && valErrors.last_name ? (
                <small className='text-danger'>{valErrors.last_name}</small>
              ) : null}
              {errors && errors.last_name && <FormFeedback>{errors.last_name.message}</FormFeedback>}
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

export default BasicTab
