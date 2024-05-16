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

import {_addAnnouncement, _editAnnouncement} from "../../../redux/actions"

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
    if (isEditAction) {
      _editAnnouncement(
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
      _addAnnouncement(
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
          {trans(isEditAction ? 'user.actions.editAnnouncement' : 'user.actions.addAnnouncement')}
        </ModalHeader>
        <ModalBody className='flex-grow-1 pb-sm-0 pb-3 modal-body'>
          <FormGroup>
            <Label className='form-label' for='text'>
              {trans('user.text')}
            </Label>
            <Controller
              as={Input}
              control={control}
              type='text'
              placeholder={useTrans('user.text')}
              id='text'
              name='text'
              rules={{
                required: trans('user.validation.required')
              }}
              defaultValue={_.get(props, 'data.text') ?? ''}
              className={classnames({ 'is-invalid': errors['text'] || _.get(valErrors, 'text') })}
            />
            <ErrorMessages valErrors={valErrors} errors={errors} name={'text'} />
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

