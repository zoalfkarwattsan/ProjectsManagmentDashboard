import React, {useEffect, useImperativeHandle, useRef} from 'react'
import Uppy from '@uppy/core'
import XHRUpload from '@uppy/xhr-upload'
import { FileInput, useUppy } from '@uppy/react'
import _ from 'lodash'
//************************************//
import {API, _toast, _getAppLang, _getRestrictions, trans, _loading} from '@utils'
import {uppyLang} from '@src/assets/data/locales/uppy'
//************************************//
const MyUppy = (({rules, onChoose, onReset, onUploadSuccess, url}, ref) => {
	const inputRef = useRef()
	const uppy = useUppy(() => {
		return new Uppy({
			autoProceed: true,
			locale:uppyLang[_getAppLang()],
			onBeforeFileAdded: (currentFile, files) => {},
			onBeforeUpload: () => { }
		}).use(XHRUpload, {
			endpoint: `${API.defaults.baseURL}/${url ?? 'file/upload'}`,
			headers: {...API.defaults.headers, Accept:'application/json'},
			timeout:5 * 60 * 1000,
			fieldName: 'file'
		}).on('restriction-failed', (file, error) => {
			// do some customized logic like showing system notice to users
			_toast(trans("gen.uppyError", {v1:file.name, v2:error.message}))
		})
			.on('file-added', (file) => {
				_loading(true)
			uppy.setFileMeta(file.id, rules)
			const reader = new FileReader()
			reader.onload = function () {
				if (_.isFunction(onChoose)) {
					onChoose(file)
				}
			}
			if (file.data) {
				reader.readAsDataURL(file.data)
			}

		})
			.on('complete', (result) => {

			})
			.on('upload-success', (file, response) => {
				_loading(false)
				uppy.removeFile(file.id)
				if (!_.isEmpty(response.body.data)) {
					onUploadSuccess(response.body.data['file'])
					try {
						_toast(response.body.data['message'])
					} catch (e) {}
				} else {
					onUploadSuccess(response.body)
				}
			})
			.on('upload-error', (file, error, response) => {
				_loading(false)
				uppy.removeFile(file.id)
				onReset()
				if (response) {
					if (response.body.data) {
						_toast(response.body.data[_.keys(response.body.data)[0]], 'error')
					} else {
						_toast(response.body.message, 'error')
					}
				} else {
					_toast('Unexpected Error', 'error')
				}
			})
	})
//************************************//
	useEffect(() => {
		uppy
			.off('file-added', () => {})
			.on('file-added', (file) => {
				// console.log('file-added')
				// console.log(file.id, rules)
				uppy.setFileMeta(file.id, rules)
			})
		uppy.setOptions({
			restrictions: _getRestrictions(rules)
		})
	}, [rules])
//************************************//
	useImperativeHandle(ref, () => ({
		handleClick: () => {
			inputRef.current.plugin.handleClick()
		}
	}))
//************************************//
	return (
		<div className='d-none'>
			<FileInput ref={inputRef} uppy={uppy} pretty={true} />
		</div>
	)
})

export default React.forwardRef(MyUppy)
