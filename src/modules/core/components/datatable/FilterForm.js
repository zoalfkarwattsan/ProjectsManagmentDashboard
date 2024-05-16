import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import Select from 'react-select'
import AsyncSelect from 'react-select/async'
import { useForm, Controller } from 'react-hook-form'
import {
  Input,
  CardBody,
  Button,
  Form,
  FormGroup,
  Label, Col, Row
} from 'reactstrap'
import _ from 'lodash'
import Flatpickr from "react-flatpickr"
//************************************//
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import CardAction from '@components/card-actions'
//************************************//
import {trans, selectThemeColors} from '@utils'
import moment from "moment"
//************************************//
const FilterForm = ({columns, onFilter, defaultCollapse}) => {
  const loading = useSelector(state => state.app.loading)
  const { handleSubmit, control, reset} = useForm()

  //************************************//
  const _reset = () => {
    const defaultValues = {}
    _.map(columns, (c, k) => {
      if (c.filter && c.filter.enabled) {
        defaultValues[c.selector] = c.type === 'select' ? null : ''
      }

    })
    reset(defaultValues)
    onFilter({})
  }
  //************************************//
  const onSubmit = data => {
    const filters = {}
    _.map(data, (v, k) => {
      if (k.indexOf('date') > -1) {
        if (_.isArray(v)) {
          filters[k] = moment(v[0]).format('Y-MM-DD')
        }
      } else if (_.isArray(v)) {
        const values = _.values(_.mapValues(v, 'value'))
        if (!_.isEmpty(values)) {
          filters[k] = values
        }
      } else if (_.isObject(v) && v.value !== '') {
        filters[k] = v.value
      } else if (!_.isEmpty(v)) {
        filters[k] = v
      }
    })
    onFilter(filters)
  }
  //************************************//
  const _renderControl = (c) => {
    const {type, options = [], isMulti = false} = c.filter
    if (type === 'select') {
      return (
        <Controller
            id={c.filter.id}
          isClearable
          isMulti={isMulti}
          as={Select}
          control={control}
          name={c.selector}
          defaultValue={null}
          options={options}
          classNamePrefix='select'
          theme={selectThemeColors}
        />
      )
    } else if (type === 'asyncSelect') {
      return (
        <Controller
            id={c.filter.id}
          isClearable
          isMulti={isMulti}
          as={AsyncSelect}
          control={control}
          name={c.selector}
          defaultValue={null}
          classNamePrefix='select'
          theme={selectThemeColors}
          defaultOptions
          cacheOptions
          loadOptions={c.filter.loadOptions}
        />
      )
    } else if (type === 'text') {
      return (
        <Controller
            id={c.filter.id}
          as={Input}
          control={control}
          name={c.selector}
          defaultValue=''
        />
      )
    } else if (type === 'date') {
      return (
        <Controller
            id={c.filter.id}
          as={Flatpickr}
          control={control}
          name={c.selector}
          className={'form-control'}
          // defaultValue={''}
          options={{
            dateFormat: 'Y-m-d'
          }}
        />
      )
    }
    return null
  }
  //************************************//
  const _renderItemCol = (c, k) => {
    if (c.filter && c.filter.enabled) {
      return (
        <Col md='4' sm='6' key={k}>
          <FormGroup>
            <Label for='react-select'>{c.name}</Label>
            {_renderControl(c)}
          </FormGroup>
        </Col>
      )
    }
    return null
  }
  //************************************//
  return (
    <CardAction title={trans('gen.actions.searchFilter')} actions='collapse' defaultCollapse={defaultCollapse}>
      <CardBody className='border-top'>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            {_.map(columns, _renderItemCol)}
          </Row>
          <FormGroup row={true} className='mt-1 d-flex justify-content-center align-items-center'>
            <Col lg={4} xs={6}>
              <Button.Ripple type='submit' color='primary' block disabled={loading}>
                <span>{trans('gen.actions.search')}</span>
              </Button.Ripple>
            </Col>
            <Col lg={4} xs={6}>
              <Button.Ripple color='secondary' block disabled={loading} onClick={_reset}>
                <span>{trans('gen.actions.reset')}</span>
              </Button.Ripple>
            </Col>
          </FormGroup>
        </Form>
      </CardBody>
    </CardAction>
  )
}

export default FilterForm
