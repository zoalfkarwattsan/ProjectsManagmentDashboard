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
  InputGroupAddon,
  InputGroup,
  InputGroupText, Row, Col
} from 'reactstrap'
import _ from "lodash"

import {trans} from '@utils'
import {ButtonSpinner, ErrorMessages} from '@src/components'
import {useTrans} from '@hooks/useTrans'

import {_addResponsible, _editResponsibleInfo} from "../../../redux/actions"
import UploadProfileImage from "../../../components/UploadProfileImage"
import Select from "react-select"

const BasicInfoModal = (props) => {

  const loading = useSelector(state => state.app.loading)
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
    setValErrors({})
    if (_.isEmpty(data.password)) {
      delete data.password
    }
    data.phone = `+961${data.phone}`
    data.responsible_types = _.map(data.responsible_types, x => x.value)
    if (isEditAction) {
      _editResponsibleInfo(
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
      _addResponsible(
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
    <Form action='/' className='flex-grow-1 d-flex flex-column' onSubmit={handleSubmit(onSubmit)}>
      <Modal
        scrollable
        isOpen={open}
        toggle={_close}
        unmountOnClose={true}
        backdrop={true}
        contentClassName='p-0'
        className={'modal-lg'}
      >
        <ModalHeader toggle={_close}>
          {trans(isEditAction ? 'user.actions.editResponsible' : 'user.actions.addResponsible')}
        </ModalHeader>
        <ModalBody className='flex-grow-1 pb-sm-0 pb-3 modal-body'>
          <FormGroup>
            <UploadProfileImage name={'image'} defaultValue={_.get(props, 'data.image')} register={register} setValue={setValue} rules={{type:['jpg', 'png']}}/>
          </FormGroup>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label className='form-label' for='fname'>
                  {trans('user.fname')}
                </Label>
                <Controller
                  as={Input}
                  control={control}
                  autoFocus
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
            <Col md={6}>
              <FormGroup>
                <Label className='form-label' for='mname'>
                  {trans('user.mname')}
                </Label>
                <Controller
                  as={Input}
                  control={control}
                  autoFocus
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
            <Col md={6}>
              <FormGroup>
                <Label className='form-label' for='lname'>
                  {trans('user.lname')}
                </Label>
                <Controller
                  as={Input}
                  control={control}
                  autoFocus
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
            <Col md={6}>
              <FormGroup>
                <Label className='form-label' for='phone'>
                  {trans('user.mobile')}
                </Label>
                <InputGroup className={classnames('input-group-merge', { 'is-invalid': errors['phone'] || _.get(valErrors, 'phone')})}>
                  <InputGroupAddon addonType='prepend'>
                    <InputGroupText>
                      LB (+961)
                    </InputGroupText>
                  </InputGroupAddon>
                  <Controller
                    as={Cleave}
                    id='phone'
                    name='phone'
                    control={control}
                    className={'form-control'}
                    defaultValue={_.get(props, 'data.phone') ? _.get(props, 'data.phone').replace('+961', '') : ''}
                    placeholder='1 234 567 8900'
                    options={{ phone: true, phoneRegionCode: 'LB' }}
                    rules={{
                      required: trans('user.validation.required')
                    }}
                  />
                </InputGroup>
                <ErrorMessages valErrors={valErrors} errors={errors} name={'phone'} />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label className='form-label' for='type'>
                  {trans('user.types')}
                </Label>
                <Controller
                  as={Select}
                  control={control}
                  isMulti={true}
                  className={classnames('react-select', { 'is-invalid': errors['responsible_types'] || _.get(valErrors, 'responsible_types') })}
                  classNamePrefix='select'
                  options={props.data.types}
                  defaultValue={_.size(props.data.responsible_types) > 0 ? _.map(props.data.responsible_types, (x => { return {label:x.name, value:x.id} })) : ''}
                  rules={{
                    required: trans('user.validation.required')
                  }}
                  isClearable={false}
                  name={'responsible_types'}
                />
                <ErrorMessages valErrors={valErrors} errors={errors} name={'responsible_types'} />
              </FormGroup>
            </Col>
            <Col md={6}>
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
                      required:value => (isEditAction || value.length > 0) || trans('user.validation.required'),
                      strong: value => ((isEditAction && value.length === 0) || value.length > 7) || trans('user.validation.mustBe8')
                    }
                  }}
                  defaultValue={''}
                  className={classnames({ 'is-invalid': errors['password'] || _.get(valErrors, 'password') })}
                />
                <ErrorMessages valErrors={valErrors} errors={errors} name={'password'} />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label className='form-label' for='address'>
                  {trans('user.inputs.address')}
                </Label>
                <Controller
                  as={Input}
                  control={control}
                  type='text'
                  placeholder={useTrans('user.inputs.address')}
                  id='address'
                  name='address'
                  rules={{
                    // required: trans('user.validation.required')
                  }}
                  defaultValue={_.get(props, 'data.address') ?? ''}
                  className={classnames({ 'is-invalid': errors['address'] || _.get(valErrors, 'address') })}
                />
                <ErrorMessages valErrors={valErrors} errors={errors} name={'address'} />
              </FormGroup>
            </Col>
            <Col md={6}>
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
                    // required: trans('user.validation.required')
                  }}
                  defaultValue={_.get(props, 'data.email') ?? ''}
                  className={classnames({ 'is-invalid': errors['email'] || _.get(valErrors, 'email') })}
                />
                <ErrorMessages valErrors={valErrors} errors={errors} name={'email'} />
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

