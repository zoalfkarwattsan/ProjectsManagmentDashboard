import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {CustomInput} from "reactstrap"

const PermissionGroupItemCheckBox = ({permission, register, index, all, setValue, data}) => {
	const [firstTime, setFirstTime] = useState(true)
	useEffect(() => {
		if (firstTime) {
			setFirstTime(false)
		} else {
			if (all) {
				setValue(`permissions.[${permission.id}]`, 'on')
			} else {
				setValue(`permissions.[${permission.id}]`, false)
			}
		}
	}, [all])
	return (
		<tr key={index}>
			<td className='text-nowrap fw-bolder'>{permission.description}{' '}
				{/*<span className={'text-muted'}>{permission.name}</span>*/}
			</td>
			<td>
				<div className='d-flex'>
					<div className='form-check me-3 me-lg-5'>
						<CustomInput defaultChecked={data.id ? data.permissions.find(x => x.name === permission.name) : false} type='checkbox' innerRef={register()} value={permission.name} name={`permissions.[${permission.id}]`} id={`read-${permission.id}`} />
					</div>
				</div>
			</td>
		</tr>
	)
}

PermissionGroupItemCheckBox.propTypes = {

}

export default PermissionGroupItemCheckBox
