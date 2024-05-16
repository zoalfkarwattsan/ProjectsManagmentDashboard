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
  InputGroupAddon, InputGroup, InputGroupText
} from 'reactstrap'
import _ from "lodash"

import {trans} from '@utils'
import {ButtonSpinner, ErrorMessages} from '@src/components'
import {useTrans} from '@hooks/useTrans'

import {_addParty, _editParty} from "../../../../redux/actions"
import Select from "react-select"

const BasicInfoModal = (props) => {

  const loading = useSelector(state => state.app.loading)
  const { errors, handleSubmit, control } = useForm()
  const [isEditAction, setIsEditAction] = useState(props.data.id)
  const [open, setOpen] = useState(true)
  const [valErrors, setValErrors] = useState({})

  const _close = () => {
    setOpen(false)
    props.onClose()
  }

  const onSubmit = (data) => {
    if (!_.isEmpty(errors)) {
      return
    }
    setValErrors({})
    data.color = data.color.value
    if (isEditAction) {
      _editParty(
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
      _addParty(
        {...data, election: props.data.electionId},
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
          {trans(isEditAction ? 'user.actions.editParty' : 'user.actions.addParty')}
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
              placeholder={useTrans('user.name')}
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
            <Label className='form-label' for='color'>
              {trans('user.color')}
            </Label>
            <Controller
              as={Select}
              control={control}
              className={classnames('react-select', { 'is-invalid': errors['color'] || _.get(valErrors, 'color') })}
              classNamePrefix='select'
              options={[{label:trans('user.white'), value:'white'}, {label:trans('user.grey'), value:'grey'}, {label:trans('user.black'), value:'black'}]}
              defaultValue={_.get(props, 'data.color') ? {label:_.get(props, 'data.color'), value:_.get(props, 'data.color') } : ''}
              rules={{
                required: trans('user.validation.required')
              }}
              isClearable={false}
              name={'color'}
            />
            <ErrorMessages valErrors={valErrors} errors={errors} name={'color'} />
          </FormGroup>
          <FormGroup>
            <Label className='form-label' for='backgroundColor'>
              {trans('user.backgroundColor')}
            </Label>
            <Controller
              as={Input}
              control={control}
              type='color'
              placeholder={useTrans('user.backgroundColor')}
              id='backgroundColor'
              name='background_color'
              rules={{
                required: trans('user.validation.required')
              }}
              defaultValue={_.get(props, 'data.background_color') ?? '#000000'}
              className={classnames({ 'is-invalid': errors['background_color'] || _.get(valErrors, 'background_color') })}
            />
            <ErrorMessages valErrors={valErrors} errors={errors} name={'background_color'} />
          </FormGroup>
          <FormGroup>
            <Label className='form-label' for='textColor'>
              {trans('user.textColor')}
            </Label>
            <Controller
              as={Input}
              control={control}
              type='color'
              placeholder={useTrans('user.textColor')}
              id='textColor'
              name='text_color'
              rules={{
                required: trans('user.validation.required')
              }}
              defaultValue={_.get(props, 'data.text_color') ?? '#000000'}
              className={classnames({ 'is-invalid': errors['text_color'] || _.get(valErrors, 'text_color') })}
            />
            <ErrorMessages valErrors={valErrors} errors={errors} name={'text_color'} />
          </FormGroup>
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

