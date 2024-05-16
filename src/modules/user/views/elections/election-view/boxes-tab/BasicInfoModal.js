import React, {useState} from 'react'
import classnames from 'classnames'
import {Controller, useForm} from 'react-hook-form'
import { useSelector } from 'react-redux'
import 'cleave.js/dist/addons/cleave-phone.us'
import {
  FormGroup,
  Label,
  Button,
  Form,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col
} from 'reactstrap'
import _ from "lodash"
import AsyncSelect from "react-select/async"
import {useParams} from "react-router-dom"

import {trans} from '@utils'
import {ButtonSpinner, ErrorMessages} from '@src/components'

import {
  _addBox,
  _editBox, _getAllDelegatesWithQ,
  _getAllUsersMunicipalitiesWithQ
} from "../../../../redux/actions"
import ElectorRepeater from "./ElectorRepeater"

const BasicInfoModal = (props) => {
  const loading = useSelector(state => state.app.loading)
  const [electors, setElectors] = useState(_.map(_.get(props, 'data.electors'), x => { return {...x, religion:{label:x.religion, value: x.religion}, gender:{label:x.gender, value: x.gender}} }) ?? [])
  const { errors, handleSubmit, control, getValues, trigger, register, unregister, setValue, value } = useForm()
  const [isEditAction, setIsEditAction] = useState(props.data.id)
  const [open, setOpen] = useState(true)
  const [valErrors, setValErrors] = useState({})
  const {id} = useParams()

  const _close = () => {
    setOpen(false)
    props.onClose()
  }

  const onSubmit = async () => {
    const data = getValues()
    const cond = await trigger()
    if (!cond) {
      return
    }
    data.municipality_id = data.municipality_id.value
    if (data.delegate_id) {
      data.delegate_id = data.delegate_id.value
    }
    data.electors = _.map(electors, x => { return {...x, religion: x.religion.value, gender: x.gender.value} })
    setValErrors({})
    if (isEditAction) {
      _editBox(
        {id:props.data.id, ...data},
        () => {
          props.successCallback()
          _close()
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
    } else {
      _addBox(
        {...data, election_id:id},
        () => {
          props.successCallback()
          _close()
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
  }

  return (
    <Form action='/' className='flex-grow-1 d-flex flex-column' onSubmit={handleSubmit(onSubmit)}>
      <Modal
        isOpen={open}
        toggle={_close}
        unmountOnClose={true}
        backdrop={true}
        contentClassName='p-0'
        className={'modal-lg'}
      >
        <ModalHeader toggle={_close}>
          {trans(isEditAction ? 'user.actions.editBox' : 'user.actions.addBox')}
        </ModalHeader>
        <ModalBody className='flex-grow-1 pb-sm-0 pb-3 modal-body'>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label className='form-label' for='name'>
                  {trans('user.name')}
                </Label>
                <Controller
                  as={Input}
                  control={control}
                  autoFocus
                  type='text'
                  placeholder=''
                  id='name'
                  name='name'
                  rules={{
                    required: trans('user.validation.required')
                  }}
                  defaultValue={_.get(props, 'data.name') ?? ''}
                  className={classnames({ 'is-invalid': errors['name'] || _.get(valErrors, 'name')})}
                />
                <ErrorMessages valErrors={valErrors} errors={errors} name={'name'} />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label className='form-label' for='municipality'>
                  {trans('user.citizens.municipality')}
                </Label>
                <Controller
                  as={AsyncSelect}
                  control={control}
                  name={'municipality_id'}
                  isClearable={false}
                  isMulti={false}
                  classNamePrefix='select'
                  defaultOptions
                  cacheOptions
                  loadOptions={_getAllUsersMunicipalitiesWithQ}
                  className={classnames('react-select', { 'is-invalid': errors['municipality_id'] || _.get(valErrors, 'municipality_id') })}
                  defaultValue={_.get(props, 'data.municipality_id') ? {label: _.get(props, 'data.municipality'), value: _.get(props, 'data.municipality_id')} : ''}
                  rules={{
                    required: trans('user.validation.required')
                  }}
                />
                <ErrorMessages valErrors={valErrors} errors={errors} name={'municipality_id'} />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label className='form-label' for='room#'>
                  {trans('user.room#')}
                </Label>
                <Controller
                  as={Input}
                  control={control}
                  autoFocus
                  type='text'
                  placeholder=''
                  id='room#'
                  name='room_number'
                  rules={{
                    required: trans('user.validation.required')
                  }}
                  defaultValue={_.get(props, 'data.room_number') ?? ''}
                  className={classnames({ 'is-invalid': errors['room_number'] || _.get(valErrors, 'room_number')})}
                />
                <ErrorMessages valErrors={valErrors} errors={errors} name={'room_number'} />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label className='form-label' for='sheet#'>
                  {trans('user.sheet#')}
                </Label>
                <Controller
                  as={Input}
                  control={control}
                  autoFocus
                  type='text'
                  placeholder=''
                  id='sheet#'
                  name='sheet_id'
                  rules={{
                    required: trans('user.validation.required')
                  }}
                  defaultValue={_.get(props, 'data.sheet_id') ?? ''}
                  className={classnames({ 'is-invalid': errors['sheet_id'] || _.get(valErrors, 'sheet_id')})}
                />
                <ErrorMessages valErrors={valErrors} errors={errors} name={'sheet_id'} />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label className='form-label' for='delegate'>
                  {trans('user.citizens.delegate')}
                </Label>
                <Controller
                  as={AsyncSelect}
                  control={control}
                  name={'delegate_id'}
                  isClearable={true}
                  isMulti={false}
                  classNamePrefix='select'
                  defaultOptions
                  cacheOptions
                  loadOptions={_getAllDelegatesWithQ}
                  className={classnames('react-select', { 'is-invalid': errors['delegate_id'] || _.get(valErrors, 'delegate_id') })}
                  defaultValue={_.get(props, 'data.delegate_id') ? {label: `${_.get(props, 'data.delegate.fname')} ${_.get(props, 'data.delegate.mname')} ${_.get(props, 'data.delegate.lname')}`, value: _.get(props, 'data.delegate.id')} : ''}
                  rules={{
                    // required: trans('user.validation.required')
                  }}
                />
                <ErrorMessages valErrors={valErrors} errors={errors} name={'delegate_id'} />
              </FormGroup>
            </Col>
            <ElectorRepeater register={register} errors={errors} valErrors={valErrors} localData={electors} setLocalData={setElectors} />
          </Row>
        </ModalBody>
        <ModalFooter className='justify-content-center'>
          <Button.Ripple type='submit' className='flex-grow-1' onClick={onSubmit} color='primary' disabled={loading}>
            { loading ? <ButtonSpinner/> : null}
            <span>{trans('gen.actions.save')}</span>
          </Button.Ripple>
          <Button.Ripple type='button' className='flex-grow-1' color='secondary' disabled={loading} onClick={_close}>
            <span>{trans('gen.actions.cancel')}</span>
          </Button.Ripple>
        </ModalFooter>
      </Modal>
    </Form>
  )
}

export default BasicInfoModal

