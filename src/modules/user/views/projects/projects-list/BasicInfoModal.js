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
  Col, CustomInput
} from 'reactstrap'
import _ from "lodash"
import AsyncSelect from "react-select/async"
import Flatpickr from "react-flatpickr"

import {trans} from '@utils'
import {ButtonSpinner, ErrorMessages} from '@src/components'
import '@styles/react/libs/flatpickr/flatpickr.scss'

import {
  _addProject,
  _editProject,
  _getAllProjectManagersWithQ,
  _getAllProjectTypesWithQ,
  _getAllUsersWithQ
} from "../../../redux/actions"
import moment from "moment"

const BasicInfoModal = (props) => {
  const loading = useSelector(state => state.app.loading)
  const [electors, setElectors] = useState(_.map(_.get(props, 'data.electors'), x => { return {...x, religion:{label:x.religion, value: x.religion}, gender:{label:x.gender, value: x.gender}} }) ?? [])
  const { errors, handleSubmit, control, getValues, trigger, register, unregister, setValue, value } = useForm()
  const [isEditAction, setIsEditAction] = useState(props.data.id)
  const [open, setOpen] = useState(true)
  const [valErrors, setValErrors] = useState({})

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
    // if (data.user_id) {
    //   data.user_id = data.user_id.value
    // }
    data.project_type_id = data.project_type_id.value
    // data.responsible_ids = _.map(data.responsible_ids, x => x.value)
    if (data.start_date === _.get(props, 'data.start_date')) {
      data.start_date = _.reverse(data.start_date.split('/')).join('-')
    } else if (moment(data.start_date[0]).format('Y-MM-DD') !== 'Invalid date') {
      data.start_date = moment(data.start_date[0]).format('Y-MM-DD')
    } else {
      data.start_date = ''
    }
    if (data.due_date === _.get(props, 'data.due_date')) {
      data.due_date = _.reverse(data.due_date.split('/')).join('-')
    } else if (data.due_date.length > 0 && moment(data.due_date[0]).format('Y-MM-DD') !== 'Invalid date') {
      data.due_date = moment(data.due_date[0]).format('Y-MM-DD')
    } else {
      delete data.due_date
    }
    setValErrors({})
    if (isEditAction) {
      _editProject(
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
      _addProject(
        {...data},
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
          {trans(isEditAction ? 'user.actions.editProject' : 'user.actions.addProject')}
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
                <Label className='form-label' for='description'>
                  {trans('user.description')}
                </Label>
                <Controller
                  as={Input}
                  control={control}
                  autoFocus
                  type='text'
                  placeholder=''
                  id='description'
                  name='description'
                  defaultValue={_.get(props, 'data.description') ?? ''}
                  className={classnames({ 'is-invalid': errors['description'] || _.get(valErrors, 'description')})}
                />
                <ErrorMessages valErrors={valErrors} errors={errors} name={'description'} />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label className='form-label' for='startDate'>
                  {trans('user.startDate')}
                </Label>
                <Controller
                  as={Flatpickr}
                  control={control}
                  id='startDate'
                  name='start_date'
                  defaultValue={_.get(props, 'data.start_date') ?? new Date()}
                  className={classnames('form-control', { 'is-invalid': errors['start_date'] || _.get(valErrors, 'start_date') })}
                  rules={{
                    required: trans('user.validation.required')
                  }}
                  options={{
                    dateFormat: 'd/m/Y'
                  }}
                />
                <ErrorMessages valErrors={valErrors} errors={errors} name={'start_date'} />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label className='form-label' for='dueDate'>
                  {trans('user.dueDate')}
                </Label>
                <Controller
                  as={Flatpickr}
                  control={control}
                  id='dueDate'
                  name='due_date'
                  defaultValue={_.get(props, 'data.due_date') ?? ''}
                  className={classnames('form-control', { 'is-invalid': errors['due_date'] || _.get(valErrors, 'due_date') })}
                  options={{
                    dateFormat: 'd/m/Y'
                  }}
                />
                <ErrorMessages valErrors={valErrors} errors={errors} name={'due_date'} />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label className='form-label' for='projectType'>
                  {trans('user.projectType')}
                </Label>
                <Controller
                  as={AsyncSelect}
                  control={control}
                  name={'project_type_id'}
                  isClearable={false}
                  isMulti={false}
                  classNamePrefix='select'
                  defaultOptions
                  cacheOptions
                  loadOptions={_getAllProjectTypesWithQ}
                  className={classnames('react-select', { 'is-invalid': errors['municipality_id'] || _.get(valErrors, 'municipality_id') })}
                  defaultValue={_.get(props, 'data.project_type_id') ? {label: _.get(props, 'data.project_type.name'), value: _.get(props, 'data.project_type_id')} : ''}
                  rules={{
                    required: trans('user.validation.required')
                  }}
                />
                <ErrorMessages valErrors={valErrors} errors={errors} name={'project_type_id'} />
              </FormGroup>
            </Col>
            {/*<Col md={6}>*/}
            {/*  <FormGroup>*/}
            {/*    <Label className='form-label' for='projectManagers'>*/}
            {/*      {trans('user.projectManagers')}*/}
            {/*    </Label>*/}
            {/*    <Controller*/}
            {/*      as={AsyncSelect}*/}
            {/*      control={control}*/}
            {/*      name={'responsible_ids'}*/}
            {/*      isClearable={true}*/}
            {/*      isMulti={true}*/}
            {/*      classNamePrefix='select'*/}
            {/*      defaultOptions*/}
            {/*      cacheOptions*/}
            {/*      loadOptions={_getAllProjectManagersWithQ}*/}
            {/*      style={{zIndex:9999}}*/}
            {/*      className={classnames('react-select', { 'is-invalid': errors['responsible_ids'] || _.get(valErrors, 'responsible_ids') })}*/}
            {/*      defaultValue={_.get(props, 'data.responsibles') ? _.map(_.get(props, 'data.responsibles'), x => { return {label:`${x.fname} ${x.mname} ${x.lname}`, value:x.id} }) : ''}*/}
            {/*      rules={{*/}
            {/*        // required: trans('user.validation.required')*/}
            {/*      }}*/}
            {/*    />*/}
            {/*    <ErrorMessages valErrors={valErrors} errors={errors} name={'responsible_ids'} />*/}
            {/*  </FormGroup>*/}
            {/*</Col>*/}
            {/*<Col md={12}>*/}
            {/*  <FormGroup>*/}
            {/*    <Label className='form-label' for='user_id'>*/}
            {/*      {trans('user.citizen')}*/}
            {/*    </Label>*/}
            {/*    <Controller*/}
            {/*      as={AsyncSelect}*/}
            {/*      control={control}*/}
            {/*      name={'user_id'}*/}
            {/*      isClearable={true}*/}
            {/*      isMulti={false}*/}
            {/*      classNamePrefix='select'*/}
            {/*      defaultOptions*/}
            {/*      cacheOptions*/}
            {/*      loadOptions={_getAllUsersWithQ}*/}
            {/*      className={classnames('react-select', { 'is-invalid': errors['user_id'] || _.get(valErrors, 'user_id') })}*/}
            {/*      defaultValue={_.get(props, 'data.user_id') ? {label:`${_.get(props, 'data.user.fname')} ${_.get(props, 'data.user.mname')} ${_.get(props, 'data.user.lname')}`, value:_.get(props, 'data.user.id')} : ''}*/}
            {/*      rules={{*/}
            {/*        // required: trans('user.validation.required')*/}
            {/*      }}*/}
            {/*    />*/}
            {/*    <ErrorMessages valErrors={valErrors} errors={errors} name={'user_id'} />*/}
            {/*  </FormGroup>*/}
            {/*</Col>*/}
            <Col md={12} className={'hidden'}>
              <FormGroup>
                <CustomInput
                    style={{zIndex:0}}
                    type={'checkbox'}
                    innerRef={register()}
                    id={'disable_notification'}
                    name={'disable_notification'}
                    label={trans('user.disableNotification')}
                    defaultChecked={false}
                />
              </FormGroup>
            </Col>
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

