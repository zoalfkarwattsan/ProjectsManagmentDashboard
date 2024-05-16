import React, {useEffect, useRef, useState} from 'react'
import {ButtonGroup, Button, Media} from 'reactstrap'
import {Plus} from "react-feather"
import {useSelector} from "react-redux"

import UploadFile from "@src/components/inputs/UploadFile"
import {ButtonSpinner} from '@src/components'
import {_url, trans} from '@utils'
import {API} from "../../../../utility/API"

const UploadExcelFile = ({rules, electionId}) => {
	const loading = useSelector(state => state.app.loading)
	const [tempFile, setTempFile] = useState(null)
	const inputRef = useRef()
	//************************************//
	const _onUploadSuccess = (v) => {
		// API.post(`user/import/${electionId}/sync`)
	}
	//************************************//
	const _resetTempLogo =  () => {}
	//************************************//
	return (
		<Media className='mb-2 d-flex flex-column align-items-center'>
			<Media className='mt-50' body>
				<div className='d-flex flex-wrap mt-1 px-0'>
					<UploadFile rules={rules} ref={inputRef} onChoose={setTempFile} onReset={_resetTempLogo} onUploadSuccess={_onUploadSuccess} url={`user/import/${electionId}/store`}/>
					<ButtonGroup size='sm' className='mb-1'>
							<Button.Ripple className='btn-icon' color='info' disabled={loading} onClick={ () => { inputRef.current.handleClick() }}>
								{ loading ? <ButtonSpinner/> : null}
								<Plus size={14} />
								<span className='ml-25'>{trans('user.actions.uploadAndSync')}</span>
							</Button.Ripple>
					</ButtonGroup>
				</div>
			</Media>
		</Media>
	)
}

UploadExcelFile.propTypes = {

}

export default UploadExcelFile
