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
  _getAllResponsiblesWithQ,
  _assignToResponsible
} from "../../../../redux/actions"

const AssignMultipleToResponsibleModal = (props) => {
  const loading = useSelector(state => state.app.loading)
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
    data.responsible_id = data.responsible_id.value
    setValErrors({})
    _assignToResponsible(
      {...data, election_id:id, user_ids: _.map(props.data.selectedRows, x => x.user_id)},
      () => {
        props.successCallback()
        // _close()
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
          {trans(isEditAction ? 'user.assignToResponsible' : 'user.assignToResponsible')}
        </ModalHeader>
        <ModalBody className='flex-grow-1 pb-sm-0 pb-3 modal-body'>
          <Row>
            <Col md={12}>
              <FormGroup>
                <Label className='form-label' for='responsible_id'>
                  {trans('user.responsibles')}
                </Label>
                <Controller
                  as={AsyncSelect}
                  control={control}
                  name={'responsible_id'}
                  isClearable={false}
                  isMulti={false}
                  classNamePrefix='select'
                  defaultOptions
                  cacheOptions
                  loadOptions={_getAllResponsiblesWithQ}
                  className={classnames('react-select', { 'is-invalid': errors['responsible_id'] || _.get(valErrors, 'responsible_id') })}
                  defaultValue={_.get(props, 'data.responsible_id') ? {label: _.get(props, 'data.responsible_id'), value: _.get(props, 'data.responsible_id')} : ''}
                  rules={{
                    required: trans('user.validation.required')
                  }}
                />
                <ErrorMessages valErrors={valErrors} errors={errors} name={'responsible_id'} />
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

export default AssignMultipleToResponsibleModal

