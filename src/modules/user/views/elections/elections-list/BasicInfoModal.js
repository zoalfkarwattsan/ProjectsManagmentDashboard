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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap'
import _ from "lodash"
import Flatpickr from 'react-flatpickr'

import {trans} from '@utils'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import {ButtonSpinner, ErrorMessages} from '@src/components'

import {_addElection, _editElection} from "../../../redux/actions"
import Select from "react-select"
import moment, {isMoment} from "moment"

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
    if (moment(data.election_date[0]).format('ddd, DD/MMMM') !== 'Invalid date') {
      data.election_date = moment(data.election_date[0]).format('ddd, DD/MMMM')
    } else {
      data.election_date = ''
    }
    data.year = data.year.value
    setValErrors({})
    if (isEditAction) {
      _editElection(
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
      _addElection(
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
          {trans(isEditAction ? 'user.actions.editElection' : 'user.actions.addElection')}
        </ModalHeader>
        <ModalBody className='flex-grow-1 pb-sm-0 pb-3 modal-body'>
          <FormGroup>
            <Label className='form-label' for='year'>
              {trans('user.year')}
            </Label>
            <Controller
              as={Select}
              control={control}
              className={classnames('react-select', { 'is-invalid': errors['year'] || _.get(valErrors, 'year') })}
              classNamePrefix='select'
              options={
                _.times(16, (x) => {
                  const cYear = new Date().getFullYear() + x
                  return {label: cYear, value: cYear}
                })
              }
              defaultValue={_.get(props, 'data.year') ? {label:_.get(props, 'data.year'), value: _.get(props, 'data.year')} : ''}
              rules={{
                required: trans('user.validation.required')
              }}
              isClearable={false}
              name={'year'}
            />
            <ErrorMessages valErrors={valErrors} errors={errors} name={'year'} />
          </FormGroup>
          <FormGroup>
            <Label className='form-label' for='electionDate'>
              {trans('user.year')}
            </Label>
            <Controller
              as={Flatpickr}
              control={control}
              id='electionDate'
              name='election_date'
              defaultValue={_.get(props, 'data.election_date') ?? new Date()}
              className={classnames('form-control', { 'is-invalid': errors['election_date'] || _.get(valErrors, 'election_date') })}
              rules={{
                required: trans('user.validation.required')
              }}
              options={{
                minDate: "today",
                dateFormat: 'D, d/M'
              }}
            />
            <ErrorMessages valErrors={valErrors} errors={errors} name={'election_date'} />
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

