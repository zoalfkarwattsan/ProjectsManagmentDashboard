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
  ModalFooter, Col
} from 'reactstrap'
import _ from "lodash"
import Select from "react-select"

import {trans} from '@utils'
import {ButtonSpinner, ErrorMessages} from '@src/components'
import {useTrans} from '@hooks/useTrans'

import {_addCandidate, _addParty, _deleteCandidate, _editCandidate, _editParty} from "../../../../redux/actions"
import UploadProfileImage from "../../../../components/UploadProfileImage"
import {Genders} from "../../../../utility/Constants"
import {Trash, Trash2, X} from "react-feather"

const CandidateModal = (props) => {

  const loading = useSelector(state => state.app.loading)
  const { errors, handleSubmit, control, register, setValue } = useForm()
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
    data.gender = data.gender.value
    if (isEditAction) {
      _editCandidate(
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
      _addCandidate(
        {...data, election_id: props.data.electionId, party_id: props.data.partyId},
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
          {isEditAction &&
            <Button.Ripple color='danger' className='btn-icon btn-sm mr-1' onClick={() => props._deleteCandidateSwal(_.get(props, 'data.id'))}>
              <Trash2 size={14}/>
            </Button.Ripple>
          }
          {trans(isEditAction ? 'user.actions.editCandidate' : 'user.actions.addCandidate')}
        </ModalHeader>
        <ModalBody className='flex-grow-1 pb-sm-0 pb-3 modal-body'>
          <FormGroup>
            <UploadProfileImage name={'image'} defaultValue={_.get(props, 'data.image')} register={register} setValue={setValue} rules={{type:['jpg', 'png']}}/>
          </FormGroup>
          <FormGroup>
            <Label className='form-label' for='fname'>
              {trans('user.fname')}
            </Label>
            <Controller
              as={Input}
              control={control}

              type='text'
              placeholder='John'
              id='fname'
              name='fname'
              rules={{
                required: trans('user.validation.required')
              }}
              defaultValue={_.get(props, 'data.fname') ?? ''}
              className={classnames({ 'is-invalid': errors['fname'] || _.get(valErrors, 'fname')})}
            />
            <ErrorMessages valErrors={valErrors} errors={errors} name={'fname'} />
          </FormGroup>
          <FormGroup>
            <Label className='form-label' for='mname'>
              {trans('user.mname')}
            </Label>
            <Controller
              as={Input}
              control={control}

              type='text'
              placeholder='John'
              id='mname'
              name='mname'
              rules={{
                required: trans('user.validation.required')
              }}
              defaultValue={_.get(props, 'data.mname') ?? ''}
              className={classnames({ 'is-invalid': errors['mname'] || _.get(valErrors, 'mname')})}
            />
            <ErrorMessages valErrors={valErrors} errors={errors} name={'mname'} />
          </FormGroup>
          <FormGroup>
            <Label className='form-label' for='lname'>
              {trans('user.lname')}
            </Label>
            <Controller
              as={Input}
              control={control}

              type='text'
              placeholder='John'
              id='lname'
              name='lname'
              rules={{
                required: trans('user.validation.required')
              }}
              defaultValue={_.get(props, 'data.lname') ?? ''}
              className={classnames({ 'is-invalid': errors['lname'] || _.get(valErrors, 'lname')})}
            />
            <ErrorMessages valErrors={valErrors} errors={errors} name={'lname'} />
          </FormGroup>
          <FormGroup>
            <Label className='form-label' for='mother_name'>
              {trans('user.motherName')}
            </Label>
            <Controller
              as={Input}
              control={control}

              type='text'
              placeholder='John'
              id='mother_name'
              name='mother_name'
              rules={{
                required: trans('user.validation.required')
              }}
              defaultValue={_.get(props, 'data.mother_name') ?? ''}
              className={classnames({ 'is-invalid': errors['mother_name'] || _.get(valErrors, 'mother_name')})}
            />
            <ErrorMessages valErrors={valErrors} errors={errors} name={'mother_name'} />
          </FormGroup>
          <FormGroup>
            <Label className='form-label' for='gender'>
              {trans('user.gender')}
            </Label>
            <Controller
              as={Select}
              control={control}
              isClearable={false}
              classNamePrefix='select'
              className={classnames({ 'is-invalid': errors['gender'] || _.get(valErrors, 'gender')})}
              id='gender'
              name='gender'
              options={[...Genders]}
              defaultValue={_.get(props, 'data.gender') ? {label:_.get(_.find(Genders, x => x.value === _.get(props, 'data.gender')), 'label'), value:_.get(props, 'data.gender')} : ''}
              rules={{
                required: trans('user.validation.required')
              }}
            />
            <ErrorMessages valErrors={valErrors} errors={errors} name={'gender'} />
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

export default CandidateModal

