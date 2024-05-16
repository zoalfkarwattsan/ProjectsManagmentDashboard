import React, {Fragment, useState} from 'react'
import PropTypes from 'prop-types'
import {CustomInput} from "reactstrap"
import PermissionGroupItemCheckBox from "./PermissionGroupItemCheckBox"

const PermissionGroupCheckBox = ({group, register, setValue, data, title}) => {
	const [all, setAll] = useState(data.id ? _.size(group.filter(x => !data.permissions.find(y => y.name === x.name))) === 0 : false)
	return (
		<Fragment>
			<tr>
				<td className='text-nowrap fw-bolder pl-0'>{title}</td>
				<td className='text-nowrap fw-bolder' style={{paddingLeft:'3.2rem'}}>
					<CustomInput
						type='checkbox'
						id={`group-${title}`}
						checked={all}
						onChange={e => setAll(e.target.checked)}
					/>
				</td>
			</tr>
			{group.map((permission, index) => {
				return (
					<PermissionGroupItemCheckBox key={index} data={data} permission={permission} register={register} index={index} all={all} setValue={setValue} />
				)
			})}
		</Fragment>
	)
}

PermissionGroupCheckBox.propTypes = {

}

export default PermissionGroupCheckBox
