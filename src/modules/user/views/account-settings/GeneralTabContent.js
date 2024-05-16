import React, {Fragment, useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Select from "react-select"
import { useForm, Controller } from 'react-hook-form'
import { Button, Label, Row, Col, Input, FormGroup, Form, FormFeedback } from 'reactstrap'
import classnames from 'classnames'
import _, {isEmpty} from "lodash"
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import Cleave from "cleave.js/react"
//************************************//
import UILoader from '@components/ui-loader'
import Spinner from '@components/spinner/Loading-spinner'
import {trans, selectThemeColors, phpToMomentFormat} from '@utils'
import {ButtonSpinner} from "@src/components"
import {global} from "@src/assets/data/constants"
import {_changeGeneralInfo} from "../../redux/actions"
import moment, {isMoment} from "moment"
//************************************//
const GeneralTabs = ({ data }) => {
  const dispatch = useDispatch()
  const loading = useSelector(state => _.get(state, 'app.loading'))
  const userData = useSelector(state => _.get(state, `${process.env.REACT_APP_AUTH_MODULE}.userData`))
  const dateFormat = useSelector(state => _.get(state, 'app.settings.app.date_format'))
  const [valErrors, setValErrors] = useState({})
  const regexp = /[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/g

  yup.addMethod(yup.string, 'maxAgeDate', function (age) {
    return this.transform(function (value, originalValue) {
      if (new Date().getFullYear() - moment(value).year() > age || new Date().getFullYear() < moment(value).year()) {
        setValErrors({birth_date:trans('user.validation.invalid_birth_date')})
      } else {
        return value
      }
    })
  })

  const ValidationSchema = yup.object().shape({
    gender: yup.object().required().nullable(),
    birth_date: yup.string().dateFormat().maxAgeDate(120).required()
  })

  const defaultValues = {
    gender : null,
    birth_date: ''
  }

  const { handleSubmit, control, setValue, errors } = useForm({ mode: 'onSubmit', resolver: yupResolver(ValidationSchema), defaultValues })

  useEffect(() => {
    if (userData.gender || userData.birth_date) {
      setValue('gender', {label:userData.gender, value:userData.gender}, { shouldValidate: true })
      setValue('birth_date', userData.birth_date, { shouldValidate: true })
    }
  }, [userData])

  const onSubmit = (data) => {
    data = {...data, gender: data.gender.value}
    if (!isEmpty(errors)) {
      return
    }
    setValErrors({})
    dispatch(
        _changeGeneralInfo(
            {...data},
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
    <UILoader blocking={loading} loader={<Spinner />} overlayColor={'transparent'}>
      <Form action='/' onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col sm='6'>
            <FormGroup>
              <Label for='username'>{trans('gen.gender')}</Label>
              <Controller
                isClearable
                as={Select}
                id='gender'
                control={control}
                name='gender'
                options={_.map(global.genders, function (a) { return {label:a, value:a} })}
                className={classnames('react-select', { 'is-invalid': (!valErrors && !_.isEmpty(valErrors.gender)) || (errors && !_.isEmpty(errors.gender)) })}
                classNamePrefix='select'
                theme={selectThemeColors}
                placeholder={trans('gen.actions.select')}
              />
              {Object.keys(valErrors).length && valErrors.gender ? (
                  <small className='text-danger'>{valErrors.gender}</small>
              ) : null}
              {errors && errors.gender && <FormFeedback>{errors.gender.message}</FormFeedback>}
            </FormGroup>
          </Col>
          <Col sm='6'>
            <FormGroup>
              <Label for='username'>{trans('gen.birthDate')}</Label>
              <Controller
                as={Cleave}
                id='birth_date'
                name='birth_date'
                control={control}
                className={classnames('form-control', {
                  'is-invalid':(!valErrors && !_.isEmpty(valErrors.birth_date)) || (errors && !_.isEmpty(errors.birth_date))
                })}
                // placeholder='1980-01-01'
                // options={{ date: true, delimiters: _.map([...dateFormat.matchAll(regexp)], '0'), datePattern: dateFormat.split(regexp) }}
              />
              {Object.keys(valErrors).length && valErrors.birth_date ? (
                  <small className='text-danger'>{valErrors.birth_date}</small>
              ) : null}
              {errors && errors.birth_date && <FormFeedback>{errors.birth_date.message}</FormFeedback>}
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
    </UILoader>
  )
}

export default GeneralTabs
