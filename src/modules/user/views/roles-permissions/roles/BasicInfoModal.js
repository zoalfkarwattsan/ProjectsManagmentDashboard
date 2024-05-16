import React, {Fragment, useState} from 'react'
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
  InputGroupAddon, InputGroup, InputGroupText, Row, Col, FormFeedback, Table, UncontrolledTooltip, CustomInput
} from 'reactstrap'
import _ from "lodash"

import {trans} from '@utils'
import {ButtonSpinner, ErrorMessages} from '@src/components'
import {useTrans} from '@hooks/useTrans'

import {_addParty, _addRole, _editParty, _editRole} from "../../../redux/actions"
import Select from "react-select"
import {Info} from "react-feather"
import PermissionGroupCheckBox from "./PermissionGroupCheckBox"

const BasicInfoModal = (props) => {

  const loading = useSelector(state => state.app.loading)
  const { errors, handleSubmit, register, setValue, getValues, trigger } = useForm()
  const [isEditAction, setIsEditAction] = useState(props.data.id)
  const [open, setOpen] = useState(true)
  const [valErrors, setValErrors] = useState({})
  const [search, setSearch] = useState('')

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
    if (!_.isEmpty(errors)) {
      return
    }
    data.name = data.name.replace(" ", "_")
    setValErrors({})
    if (isEditAction) {
      _editRole(
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
      _addRole(
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
        className='modal-lg'
        // contentClassName='p-0'
      >
        <ModalHeader toggle={_close} className='mb-1'>
          {trans(isEditAction ? 'user.actions.editRole' : 'user.actions.addRole')}
        </ModalHeader>
        <ModalBody className='flex-grow-1 pb-sm-0 pb-3 modal-body'>
            <FormGroup>
              <Row>
                <Col xs={6}>
                  <Label className='form-label' for='roleName'>
                    Name
                  </Label>
                  <Input defaultValue={_.get(props.data, 'name') ? _.get(props.data, 'name').replace("_", " ") : ''} innerRef={register({required:true})} name='name'/>
                </Col>
                <Col xs={6}>
                  <Label className='form-label' for='roleName'>
                    Description
                  </Label>
                  <Input defaultValue={_.get(props.data, 'description')} innerRef={register({required:true})} name='description'/>
                </Col>
              </Row>
            </FormGroup>
            {/*<Row>*/}
            {/*  <Col xs={12}>*/}
            {/*    <Label className='form-label' for='roleName'>*/}
            {/*      Permission Name*/}
            {/*    </Label>*/}
            {/*    <Input placeholder='Enter permission name' value={search} onChange={e => setSearch(e.target.value)}/>*/}
            {/*  </Col>*/}
            {/*</Row>*/}
           <Row>
             <Col xs={12}>
               <h4 className='mt-2 pt-50'>Permissions</h4>
               <Table className='table-flush-spacing' responsive>
                 <tbody>
                 {_.map(_.groupBy(props?.permissions?.filter(x => x.description.toLowerCase().indexOf(search) > -1), x => x.group), (x, i) => {
                   return (
                     <PermissionGroupCheckBox key={i} title={i} data={props.data} group={x} register={register} setValue={setValue} />
                   )
                 })}
                 </tbody>
               </Table>
             </Col>
           </Row>
        </ModalBody>
        <ModalFooter className='justify-content-center'>
          <Button.Ripple type='submit' className='flex-grow-1' color='primary' onClick={onSubmit} disabled={loading}>
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

