import React, {useState} from 'react'
import classnames from 'classnames'
import {Controller, useForm} from 'react-hook-form'
import {useSelector} from 'react-redux'
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
    _addTask,
    _editTask,
    _getAllProjectManagersForProjectWithQ, _getAllStatusesWithQ
} from "../../../redux/actions"
import moment from "moment"
import {useParams} from "react-router-dom"

const BasicInfoModal = (props) => {
    const loading = useSelector(state => state.app.loading)
    const [electors, setElectors] = useState(_.map(_.get(props, 'data.electors'), x => {
        return {...x, religion: {label: x.religion, value: x.religion}, gender: {label: x.gender, value: x.gender}}
    }) ?? [])
    const {errors, handleSubmit, control, getValues, trigger, register, unregister, setValue, value} = useForm()
    const [isEditAction, setIsEditAction] = useState(props.data.id)
    const [open, setOpen] = useState(true)
    const [status, setStatus] = useState(_.get(props, 'data.status_id') ? {
        label: _.get(props, 'data.status.name'),
        value: _.get(props, 'data.status_id')
    } : {
        label: 'Pending',
        value: 1
    })
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
        data.status_id = status.value
        if (data.due_date === _.get(props, 'data.due_date')) {
            data.due_date = _.reverse(data.due_date.split('/')).join('-')
        } else if (data.due_date.length > 0 && moment(data.due_date[0]).format('Y-MM-DD') !== 'Invalid date') {
            data.due_date = moment(data.due_date[0]).format('Y-MM-DD')
        } else {
            delete data.due_date
        }
        setValErrors({})
        if (isEditAction) {
            _editTask(
                {id: props.data.id, project_id: props.data.projectId, ...data},
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
            _addTask(
                {...data, project_id: props.data.projectId},
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
                className='sidebar-lg'
                modalClassName='modal-slide-in sidebar-todo-modal'
            >
                <ModalHeader toggle={_close}>
                    {trans(isEditAction ? 'user.actions.editTask' : 'user.actions.addTask')}
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
                            placeholder=''
                            id='name'
                            name='name'
                            rules={{
                                required: trans('user.validation.required')
                            }}
                            defaultValue={_.get(props, 'data.name') ?? ''}
                            className={classnames({'is-invalid': errors['name'] || _.get(valErrors, 'name')})}
                        />
                        <ErrorMessages valErrors={valErrors} errors={errors} name={'name'}/>
                    </FormGroup>

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
                            className={classnames({'is-invalid': errors['description'] || _.get(valErrors, 'description')})}
                        />
                        <ErrorMessages valErrors={valErrors} errors={errors} name={'description'}/>
                    </FormGroup>

                    <FormGroup>
                        <Label className='form-label' for='projectManager'>
                            {trans('user.projectManager')}
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
                            loadOptions={(q) => _getAllProjectManagersForProjectWithQ(props.data.projectId, q)}
                            className={classnames('react-select', {'is-invalid': errors['responsible_id'] || _.get(valErrors, 'responsible_id')})}
                            defaultValue={_.get(props, 'data.responsible_id') ? {
                                label: `${_.get(props, 'data.responsible.fname')} ${_.get(props, 'data.responsible.mname')} ${_.get(props, 'data.responsible.lname')}`,
                                value: _.get(props, 'data.responsible.id')
                            } : ''}
                            rules={{
                                required: trans('user.validation.required')
                            }}
                        />
                        <ErrorMessages valErrors={valErrors} errors={errors} name={'responsible_id'}/>
                    </FormGroup>

                    <FormGroup>
                        <Label className='form-label' for='status'>
                            {trans('user.status.status')}
                        </Label>
                        <AsyncSelect
                            // as={AsyncSelect}
                            // control={control}
                            value={status}
                            onChange={(option) => setStatus(option)}
                            name={'status_id'}
                            isClearable={false}
                            isMulti={false}
                            classNamePrefix='select'
                            defaultOptions
                            cacheOptions
                            loadOptions={_getAllStatusesWithQ}
                            className={classnames('react-select', {'is-invalid': errors['status_id'] || _.get(valErrors, 'status_id')})}
                            // rules={{
                            //   required: trans('user.validation.required')
                            // }}
                        />
                        <ErrorMessages valErrors={valErrors} errors={errors} name={'status_id'}/>
                    </FormGroup>

                    {status.value === 5 && <FormGroup>
                        <Label className='form-label' for='failed_reason'>
                            {trans('user.actions.failedReason')}
                        </Label>
                        <Controller
                            as={Input}
                            control={control}
                            autoFocus
                            type='text'
                            placeholder=''
                            id='failed_reason'
                            name='failed_reason'
                            defaultValue={_.get(props, 'data.failed_reason') ?? ''}
                            className={classnames({'is-invalid': errors['failed_reason'] || _.get(valErrors, 'failed_reason')})}
                            rules={{
                                required: trans('user.validation.required')
                            }}
                        />
                        <ErrorMessages valErrors={valErrors} errors={errors} name={'failed_reason'}/>
                    </FormGroup>}

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
                            className={classnames('form-control', {'is-invalid': errors['due_date'] || _.get(valErrors, 'due_date')})}
                            options={{
                                dateFormat: 'Y-m-d'
                            }}
                        />
                        <ErrorMessages valErrors={valErrors} errors={errors} name={'due_date'}/>
                    </FormGroup>

                    <FormGroup>
                        <CustomInput
                            style={{zIndex: 0}}
                            type={'checkbox'}
                            innerRef={register()}
                            id={'disable_notification'}
                            name={'disable_notification'}
                            label={trans('user.disableNotification')}
                            defaultChecked={false}
                        />
                    </FormGroup>
                </ModalBody>
                <ModalFooter className='justify-content-center'>
                    <Button.Ripple type='submit' className='flex-grow-1' onClick={onSubmit} color='primary'
                                   disabled={loading}>
                        {loading ? <ButtonSpinner/> : null}
                        <span>{trans('gen.actions.save')}</span>
                    </Button.Ripple>
                    <Button.Ripple type='button' className='flex-grow-1' color='secondary' disabled={loading}
                                   onClick={_close}>
                        <span>{trans('gen.actions.cancel')}</span>
                    </Button.Ripple>
                </ModalFooter>
            </Modal>
        </Form>
    )
}

export default BasicInfoModal

