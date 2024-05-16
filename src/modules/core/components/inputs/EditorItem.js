import React, {useEffect, useState} from 'react'
import {FormGroup, Col, Input, Label, FormFeedback, CustomInput} from 'reactstrap'
import classnames from 'classnames'
import _ from "lodash"
import {  convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import {Controller} from 'react-hook-form'
/* ****************************************************** */
import TextEditor from "@src/components/inputs/TextEditor"

const EditorItem = ({options, read_only, name, code, value, description}, control, errors, register, setValue, valErrors) => {
	register(`settings[${code}]`, {required: true})
	// register(`sub-${code}`, {required: true})

	const [content, setContent] = useState(null)

	useEffect(() => {
		setValue(`settings[${code}]`, `${content && draftToHtml(convertToRaw(content.getCurrentContent()))}`)
		// try {
		// 	setValue(`sub-${code}`, content.getCurrentContent().getPlainText())
		// } catch (e) {
		// }
	}, [content])

	return <Col sm={12}>
		<FormGroup>
			<Label for={code}>{name}</Label>
			<TextEditor
				initValue={value}
				content={content}
				setContent={setContent}
				id={code}
				name={`settings[${code}]`}
				editorClassName={classnames('', {'is-invalid': (errors && !_.isEmpty(_.get(errors, `sub-${code}`)))})}
				readOnly={read_only}
			/>
			{/*<Controller*/}
			{/*	as={Input}*/}
			{/*	type={'hidden'}*/}
			{/*	id={`id-${code}`}*/}
			{/*	disabled={read_only}*/}
			{/*	control={control}*/}
			{/*	name={`sub-${code}`}/>*/}
			{Object.keys(valErrors).length && _.get(valErrors, code) ? (
				<small className='text-danger'>{_.get(valErrors, code)}</small>
			) : null}
			{errors && _.get(errors, `sub-${code}`) && <FormFeedback>_.get(errors,`sub-${code}.message`)</FormFeedback>}
			<small className='text-muted'>{description}</small>
		</FormGroup>
	</Col>
}

EditorItem.propTypes = {

}

export default EditorItem
