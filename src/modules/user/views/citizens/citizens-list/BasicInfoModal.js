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
  ModalFooter, Col, Row
} from 'reactstrap'
import _ from "lodash"
import Select from "react-select"
import AsyncSelect from "react-select/async"

import {trans} from '@utils'
import {ButtonSpinner, ErrorMessages} from '@src/components'

import {Genders} from "../../../utility/Constants"
import {
  _addCitizen,
  _editCitizen,
  _getAllNationalitiesWithQ
} from "../../../redux/actions"

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
    data.nationality_id = data.nationality_id.value
    if (isEditAction) {
      _editCitizen(
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
      _addCitizen(
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
      contentClassName='p-0'
      className={'modal-lg'}
    >
      <Form action='/' className='flex-grow-1 d-flex flex-column' onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader toggle={_close} className='mb-1'>

          {trans(isEditAction ? 'user.actions.editCitizen' : 'user.actions.addCitizen')}
        </ModalHeader>
        <ModalBody className='flex-grow-1 pb-sm-0 pb-3 modal-body'>
          <Row>
            <Col sm={6}>
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
            </Col>
            <Col sm={6}>
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
            </Col>
            <Col sm={6}>
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
            </Col>
            <Col sm={6}>
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
            </Col>
            <Col sm={6}>
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
            </Col>
            <Col sm={6}>
              <FormGroup>
                <Label className='form-label' for='notes'>
                  {trans('user.notes')}
                </Label>
                <Controller
                  as={Input}
                  control={control}
                  type='text'
                  placeholder=''
                  id='notes'
                  name='notes'
                  defaultValue={_.get(props, 'data.notes') ?? ''}
                  className={classnames({ 'is-invalid': errors['notes'] || _.get(valErrors, 'notes')})}
                />
                <ErrorMessages valErrors={valErrors} errors={errors} name={'notes'} />
              </FormGroup>
            </Col>
            <Col sm={6}>
              <FormGroup>
                <Label className='form-label' for='address'>
                  {trans('user.inputs.address')}
                </Label>
                <Controller
                  as={Input}
                  control={control}
                  type='text'
                  placeholder=''
                  id='notes'
                  name='address'
                  defaultValue={_.get(props, 'data.address') ?? ''}
                  className={classnames({ 'is-invalid': errors['address'] || _.get(valErrors, 'address')})}
                />
                <ErrorMessages valErrors={valErrors} errors={errors} name={'address'} />
              </FormGroup>
            </Col>
            <Col sm={6}>
              <FormGroup>
                <Label className='form-label' for='civil_registration'>
                  {trans('user.citizens.civilRegistration')}
                </Label>
                <Controller
                  as={Input}
                  control={control}
                  type='number'
                  placeholder=''
                  id='notes'
                  name='civil_registration'
                  rules={{
                    required: trans('user.validation.required')
                  }}
                  defaultValue={_.get(props, 'data.civil_registration') ?? ''}
                  className={classnames({ 'is-invalid': errors['civil_registration'] || _.get(valErrors, 'civil_registration')})}
                />
                <ErrorMessages valErrors={valErrors} errors={errors} name={'civil_registration'} />
              </FormGroup>
            </Col>
            <Col sm={6}>
              <FormGroup>
                <Label className='form-label' for='personal_religion'>
                  {trans('user.citizens.personalReligion')}
                </Label>
                <Controller
                  as={Input}
                  control={control}
                  type='text'
                  placeholder=''
                  id='notes'
                  name='personal_religion'
                  rules={{
                    required: trans('user.validation.required')
                  }}
                  defaultValue={_.get(props, 'data.personal_religion') ?? ''}
                  className={classnames({ 'is-invalid': errors['personal_religion'] || _.get(valErrors, 'personal_religion')})}
                />
                <ErrorMessages valErrors={valErrors} errors={errors} name={'personal_religion'} />
              </FormGroup>
            </Col>
            <Col sm={6}>
              <FormGroup>
                <Label className='form-label' for='record_religion'>
                  {trans('user.citizens.recordReligion')}
                </Label>
                <Controller
                  as={Input}
                  control={control}
                  type='text'
                  placeholder=''
                  id='notes'
                  name='record_religion'
                  rules={{
                    required: trans('user.validation.required')
                  }}
                  defaultValue={_.get(props, 'data.record_religion') ?? ''}
                  className={classnames({ 'is-invalid': errors['record_religion'] || _.get(valErrors, 'record_religion')})}
                />
                <ErrorMessages valErrors={valErrors} errors={errors} name={'record_religion'} />
              </FormGroup>
            </Col>
            <Col sm={6}>
              <FormGroup>
                <Label className='form-label' for='nationality'>
                  {trans('user.citizens.nationality')}
                </Label>
                <Controller
                  as={AsyncSelect}
                  control={control}
                  name={'nationality_id'}
                  isClearable={false}
                  isMulti={false}
                  classNamePrefix='select'
                  defaultOptions
                  cacheOptions
                  loadOptions={_getAllNationalitiesWithQ}
                  className={classnames('react-select', { 'is-invalid': errors['nationality_id'] || _.get(valErrors, 'nationality_id') })}
                  defaultValue={_.get(props, 'data.nationality_id') ? {label:`${_.get(props, 'data.nationality.name')}`, value:_.get(props, 'data.nationality_id')} : ''}
                  rules={{
                    required: trans('user.validation.required')
                  }}
                />
                <ErrorMessages valErrors={valErrors} errors={errors} name={'nationality_id'} />
              </FormGroup>
            </Col>
            <Col sm={6}>
              <FormGroup>
                <Label className='form-label' for='phone'>
                  {trans('user.phone')}
                </Label>
                <Controller
                  as={Input}
                  control={control}
                  type='text'
                  placeholder=''
                  id='notes'
                  name='phone'
                  defaultValue={_.get(props, 'data.phone') ?? ''}
                  className={classnames({ 'is-invalid': errors['phone'] || _.get(valErrors, 'phone')})}
                />
                <ErrorMessages valErrors={valErrors} errors={errors} name={'phone'} />
              </FormGroup>
            </Col>
          </Row>
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

