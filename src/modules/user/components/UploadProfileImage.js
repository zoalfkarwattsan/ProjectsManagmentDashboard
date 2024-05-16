import React, {useEffect, useRef, useState} from 'react'
import {ButtonGroup, Button, Media} from 'reactstrap'

import UploadImage from "@src/components/inputs/UploadImage"

import {_url, trans} from '@utils'

const UploadProfileImage = ({rules, name, defaultValue, register, setValue}) => {
	const [tempImage, setTempImage] = useState(null)
	const inputRef = useRef()
	//************************************//
	useEffect(() => {
		register(name)
		setValue(name, defaultValue ?? '')
		setTempImage(defaultValue ? _url(defaultValue) : null)
	}, [])

	//************************************//
	const _onUploadLogo = (v) => {
		setTempImage(_url(v))
		setValue(name, v)
	}
	//************************************//
	const _resetTempLogo =  () => {
		setTempImage(null)
		setValue(name, '')
	}
	//************************************//
	const _deleteLogo =  () => {
		setTempImage(null)
		setValue(name, '')
	}
	//************************************//
	const _renderEditLogo = () => {
			return (
				<img
					onClick={ () => { inputRef.current.handleClick() }}
					className='user-avatar rounded my-25 cursor-pointer'
					src={tempImage !== null ? tempImage : require('@src/assets/images/icons/jpg.png').default}
					height='100'
					width='100'
				/>
			)
	}
	return (
		<Media className='mb-2 d-flex flex-column align-items-center'>
			{_renderEditLogo()}
			<Media className='mt-50' body>
				<div className='d-flex flex-wrap mt-1 px-0'>
					<UploadImage rules={rules} ref={inputRef} onChoose={setTempImage} onReset={_resetTempLogo} onUploadSuccess={_onUploadLogo}/>
					<ButtonGroup size='sm' className='mb-1'>
						<Button color='success' type='button' onClick={ () => { inputRef.current.handleClick() }}>{trans('gen.actions.upload')}</Button>
						{/*{(tempLogo !== null || logo === 'delete') && <Button color='warning' type='button' onClick={_resetTempLogo}>{trans('gen.actions.reset')}</Button>}*/}
						{tempImage && <Button color='danger' type='button' onClick={_deleteLogo}>{trans('gen.actions.delete')}</Button>}
					</ButtonGroup>
				</div>
			</Media>
		</Media>
	)
}

UploadProfileImage.propTypes = {

}

export default UploadProfileImage
