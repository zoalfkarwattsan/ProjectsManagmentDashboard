import React, {useState} from 'react'
import classnames from 'classnames'
import {Controller, useForm} from 'react-hook-form'
import { useSelector } from 'react-redux'
import Cleave from 'cleave.js/react'
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
  InputGroupAddon, InputGroup, InputGroupText, Col
} from 'reactstrap'
import _ from "lodash"

import {trans} from '@utils'
import {ButtonSpinner, ErrorMessages} from '@src/components'
import {useTrans} from '@hooks/useTrans'

import {_addAdmin, _editAdminInfo, _getAllResponsiblesWithQ, _getAllRolesWithQ} from "../../redux/actions"
import AsyncSelect from "react-select/async"

const BasicInfoModal = (props) => {

  const loading = useSelector(state => state.app.loading)
  const { errors, handleSubmit, control } = useForm()
  const [isEditAction, setIsEditAction] = useState(props.data.id)
  const [open, setOpen] = useState(true)
  const [valErrors, setValErrors] = useState({})
  const strongPasswordRegExp = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")

  const _close = () => {
    setOpen(false)
    props.onClose()
  }

  const onSubmit = (data) => {
    if (!_.isEmpty(errors)) {
      return
    }
    setValErrors({})
    if (_.isEmpty(data.password)) {
      delete data.password
    }
    data.phone = `+961${data.phone}`
    if (data.role_id) {
      data.role_id = data.role_id.value
    }
    if (isEditAction) {
      _editAdminInfo(
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
      _addAdmin(
        data,
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
    <Modal
      isOpen={open}
      toggle={_close}
      unmountOnClose={true}
      backdrop={true}
      className='sidebar-lg'
      contentClassName='p-0'
      modalClassName='modal-slide-in sidebar-todo-modal'
    >
      <Form action='/' className='flex-grow-1 d-flex flex-column' onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader toggle={_close} className='mb-1'>
          {trans(isEditAction ? 'user.actions.editAdmin' : 'user.actions.addAdmin')}
        </ModalHeader>
        <ModalBody className='flex-grow-1 pb-sm-0 pb-3 modal-body'>
          <FormGroup>
            <Label className='form-label' for='name'>
              {trans('user.name')}
            </Label>
            <Controller
              as={Input}
              control={control}
              autoFocus
              type='text'
              placeholder='John'
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
          <FormGroup>
            <Label className='form-label' for='email'>
              {trans('user.email')}
            </Label>
            <Controller
              as={Input}
              control={control}
              type='email'
              placeholder={useTrans('user.email')}
              id='email'
              name='email'
              rules={{
                required: trans('user.validation.required')
              }}
              defaultValue={_.get(props, 'data.email') ?? ''}
              className={classnames({ 'is-invalid': errors['email'] || _.get(valErrors, 'email') })}
            />
            <ErrorMessages valErrors={valErrors} errors={errors} name={'email'} />
          </FormGroup>
          <FormGroup>
            <Label className='form-label' for='password'>
              {trans('user.password')}
            </Label>
            <Controller
              as={Input}
              control={control}
              type='password'
              id='new-password'
              name='password'
              placeholder={useTrans('user.password')}
              rules={{
                validate: {
                  required: value => (isEditAction || value.length > 0) || trans('user.validation.required'),
                  strong: value => ((isEditAction && value.length === 0) || strongPasswordRegExp.test(value)) || trans('user.validation.weakPassword')
                }
              }}
              defaultValue={''}
              className={classnames({ 'is-invalid': errors['password'] || _.get(valErrors, 'password') })}
            />
            <ErrorMessages valErrors={valErrors} errors={errors} name={'password'} />
          </FormGroup>
          <FormGroup>
            <Label className='form-label' for='password'>
              {trans('user.mobile')}
            </Label>
            <InputGroup className='input-group-merge'>
              <InputGroupAddon addonType='prepend'>
                <InputGroupText
                  className={''}
                >
                  LB (+961)
                </InputGroupText>
              </InputGroupAddon>
              <Controller
                as={Cleave}
                id='phone-number'
                name='phone'
                control={control}
                className={'form-control'}
                defaultValue={_.get(props, 'data.phone') ? _.get(props, 'data.phone').replace('+961', '') : ''}
                placeholder='1 234 567 8900'
                options={{ phone: true, phoneRegionCode: 'LB' }}
              />
            </InputGroup>
            <ErrorMessages valErrors={valErrors} errors={errors} name={'phone'} />
          </FormGroup>
          {_.get(props, 'data.id') !== 1 &&
            <FormGroup>
              <Label className='form-label' for='role_id'>
                {trans('user.role')}
              </Label>
              <Controller
                as={AsyncSelect}
                control={control}
                name={'role_id'}
                isClearable={false}
                isMulti={false}
                classNamePrefix='select'
                defaultOptions
                cacheOptions
                loadOptions={_getAllRolesWithQ}
                className={classnames('react-select', { 'is-invalid': errors['role_id'] || _.get(valErrors, 'role_id') })}
                defaultValue={_.get(props, 'data.role_id') ? {label: _.get(props, 'data.role_name').replace("_", " "), value: _.get(props, 'data.role_id')} : ''}
                rules={{
                  required: trans('user.validation.required')
                }}
              />
              <ErrorMessages valErrors={valErrors} errors={errors} name={'role_id'} />
            </FormGroup>
          }
        </ModalBody>
        <ModalFooter className='justify-content-center'>
          <Button.Ripple type='submit' className='flex-grow-1' color='primary' disabled={loading}>
            { loading ? <ButtonSpinner/> : null}
            <span>{trans('gen.actions.save')}</span>
          </Button.Ripple>
          <Button.Ripple type='button' className='flex-grow-1' color='secondary' disabled={loading} onClick={_close}>
            <span>{trans('gen.actions.cancel')}</span>
          </Button.Ripple>
        </ModalFooter>
      </Form>
    </Modal>
  )
}

export default BasicInfoModal

