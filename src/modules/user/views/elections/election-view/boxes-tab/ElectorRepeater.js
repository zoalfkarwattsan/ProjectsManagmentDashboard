import React, {useState} from 'react'
import {Button, Row, Col, Input, Table, Label, FormGroup} from 'reactstrap'
import _ from 'lodash'
import {X, Plus} from 'react-feather'
import {useSelector} from "react-redux"
import Select from "react-select"
import AsyncSelect from "react-select/async"
//************************************//
import {trans} from '@utils'
import {ErrorMessages} from '@src/components'
//************************************//
import {Genders} from "../../../../utility/Constants"
import {_getAllRecordReligionsWithQ} from "../../../../redux/actions"
import classnames from "classnames"
//************************************//

const ElectorRepeater = ({register, errors, localData, setLocalData, valErrors}) => {
	const loading = useSelector(state => state.app.loading)

	const addRow = () => {
		let maxId = 0
		localData.forEach(x => {
			maxId = Math.max(x.id, maxId)
		})
		setLocalData(localData.concat({id: ++maxId, civil_registration_from: '', civil_registration_to: '', religion: '', gender: ''}))
	}

	const deleteRow = (selected) => {
			setLocalData(localData.filter(x => x.id !== selected.id))
	}

	const changeInputValue = (e, dataItem, clmn) => {
		const tempData = [...localData]
		tempData.find(x => x.id === dataItem.id)[clmn] = e.target.value
		setLocalData(tempData)
	}

	const changeSelectValue = (val, dataItem, clmn) => {
		const tempData = [...localData]
		tempData.find(x => x.id === dataItem.id)[clmn] = val
		setLocalData(tempData)
	}

	return (
		<Col sm='12 mt-1'>
			<FormGroup>
				<h5 className='form-label'>
					{trans('user.electors')}
				</h5>
				{_.map(localData, (dataItem, i) => {
					return (
						<Row key={i}>
							<Col lg={2} md={3} sm={6} xs={12}>
								<FormGroup>
									<Label>{trans('user.from')}</Label>
									<Input
										type='text'
										name={`electors.${i}.civil_registration_from`}
										className={classnames({ 'is-invalid': _.get(valErrors, `electors.${i}.civil_registration_from`)})}
										value={dataItem.civil_registration_from}
										onChange={e => changeInputValue(e, dataItem, 'civil_registration_from')}
									/>
								</FormGroup>
							</Col>
							<Col lg={2} md={3} sm={6} xs={12}>
								<FormGroup>
									<Label>{trans('user.to')}</Label>
									<Input
										type='text'
										name={`electors.${i}.civil_registration_to`}
										className={classnames({ 'is-invalid': _.get(valErrors, `electors.${i}.civil_registration_to`) || _.get(errors, `electors.${i}.civil_registration_to`)})}
										value={dataItem.civil_registration_to}
										onChange={e => changeInputValue(e, dataItem, 'civil_registration_to')}
										innerRef={register({validate:value => value >= dataItem.civil_registration_from || trans('user.validation.min', {value:dataItem.civil_registration_from})})}
									/>
									<ErrorMessages valErrors={valErrors} errors={errors} name={`electors.${i}.civil_registration_to`} />
								</FormGroup>
							</Col>
							<Col lg={4} md={4} sm={5} xs={12}>
								<FormGroup>
									<Label>{trans('user.religion')}</Label>
									<AsyncSelect
										isClearable={false}
										isMulti={false}
										className={classnames({ 'validation-error': _.get(valErrors, `electors.${i}.religion`)})}
										classNamePrefix='select'
										defaultOptions
										cacheOptions
										loadOptions={_getAllRecordReligionsWithQ}
										required type='text'
										defaultValue={dataItem.religion}
										value={dataItem.religion}
										onChange={e => changeSelectValue(e, dataItem, 'religion')}
									/>
								</FormGroup>
							</Col>
							<Col lg={3} md={3} sm={5} xs={10}>
								<FormGroup>
									<Label>{trans('user.gender')}</Label>
									<Select
										options={[...Genders, {label:trans('user.mix'), value: 'mix'}]}
										isClearable={false}
										className={classnames('react-select', { 'is-invalid': _.get(valErrors, `electors.${i}.gender`)})}
										classNamePrefix='select'
										value={dataItem.gender}
										onChange={e => changeSelectValue(e, dataItem, 'gender')}
									/>
								</FormGroup>
							</Col>
							<Col lg={1} xs={2} className={'pb-1 d-flex align-items-end'}>
								<FormGroup className={'mb-0'}>
									<Button.Ripple color='danger' className='btn-icon btn-sm form-control' onClick={() => deleteRow(dataItem)} outline>
										<X size={14}/>
									</Button.Ripple>
								</FormGroup>
							</Col>
						</Row>
					)
				})}
				<Button.Ripple className='pl-0 pr-1' color='flat-primary' onClick={addRow} disabled={loading}>
					<Plus size={16}/>
					<span className='align-middle ml-25'>{trans('gen.actions.add')}</span>
				</Button.Ripple>
			</FormGroup>
		</Col>
	)
}

ElectorRepeater.propTypes = {}

export default ElectorRepeater
