import React, {useEffect, useState} from 'react'
import { Editor } from 'react-draft-wysiwyg'
import { EditorState, ContentState, convertToRaw } from 'draft-js'
import htmlToDraft from 'html-to-draftjs'
import '@styles/react/libs/editor/editor.scss'
import '@styles/base/plugins/forms/form-quill-editor.scss'

const TextEditor = (props) => {
	const {content, setContent, initValue} = props
	const initialContent = initValue
	const contentBlock = htmlToDraft(initialContent)
	const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
	const editorState = EditorState.createWithContent(contentState)
	useEffect(() => {
		setContent(editorState)
	}, [])

	return <Editor
				editorState={content}
				onEditorStateChange={data => setContent(data)}
				toolbar={{
					options: [
						'inline', 'blockType',
						// 'fontFamily',
						'list', 'textAlign', 'colorPicker', 'link',
						// 'embedded',
						'emoji',
						// 'image',
						'remove', 'history'
					],
					inline: {
						inDropdown: false,
						className: undefined,
						component: undefined,
						dropdownClassName: undefined,
						options: [
							'bold', 'italic', 'underline', 'strikethrough'
							// , 'monospace', 'superscript', 'subscript'
						],
						bold: { className: undefined },
						italic: { className: undefined },
						underline: { className: undefined },
						strikethrough: { className: undefined },
						monospace: { className: undefined },
						superscript: { className: undefined },
						subscript: { className: undefined }
					},
					blockType: {
						inDropdown: true,
						options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote', 'Code'],
						className: undefined,
						component: undefined,
						dropdownClassName: undefined
					},
					fontSize: {
						options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96],
						className: undefined,
						component: undefined,
						dropdownClassName: undefined
					},
					fontFamily: {
						options: ['Arial', 'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana'],
						className: undefined,
						component: undefined,
						dropdownClassName: undefined
					},
					list: {
						inDropdown: false,
						className: undefined,
						component: undefined,
						dropdownClassName: undefined,
						options: ['unordered', 'ordered', 'indent', 'outdent'],
						unordered: { className: undefined },
						ordered: { className: undefined },
						indent: { className: undefined },
						outdent: { className: undefined }
					},
					textAlign: {
						inDropdown: false,
						className: undefined,
						component: undefined,
						dropdownClassName: undefined,
						options: ['left', 'center', 'right', 'justify'],
						left: { className: undefined },
						center: { className: undefined },
						right: { className: undefined },
						justify: { className: undefined }
					},
					colorPicker: {
						className: undefined,
						component: undefined,
						popupClassName: undefined,
						colors: [
							'rgb(97,189,109)', 'rgb(26,188,156)', 'rgb(84,172,210)', 'rgb(44,130,201)',
							'rgb(147,101,184)', 'rgb(71,85,119)', 'rgb(204,204,204)', 'rgb(65,168,95)', 'rgb(0,168,133)',
							'rgb(61,142,185)', 'rgb(41,105,176)', 'rgb(85,57,130)', 'rgb(40,50,78)', 'rgb(0,0,0)',
							'rgb(247,218,100)', 'rgb(251,160,38)', 'rgb(235,107,86)', 'rgb(226,80,65)', 'rgb(163,143,132)',
							'rgb(239,239,239)', 'rgb(255,255,255)', 'rgb(250,197,28)', 'rgb(243,121,52)', 'rgb(209,72,65)',
							'rgb(184,49,47)', 'rgb(124,112,107)', 'rgb(209,213,216)'
						],
						defaultSize: {
							height: 'auto',
							width: '500px'
						}
					},
					link: {
						inDropdown: false,
						className: undefined,
						component: undefined,
						popupClassName: undefined,
						dropdownClassName: undefined,
						showOpenOptionOnHover: true,
						defaultTargetOption: '_self',
						options: ['link', 'unlink'],
						link: { className: undefined },
						unlink: { className: undefined },
						linkCallback: undefined
					},
					emoji: {
						className: undefined,
						component: undefined,
						popupClassName: undefined,
						emojis: [
							'😀', '😁', '😂', '😃', '😉', '😋', '😎', '😍', '😗', '🤗', '🤔', '😣', '😫', '😴', '😌', '🤓',
							'😛', '😜', '😠', '😇', '😷', '😈', '👻', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '🙈',
							'🙉', '🙊', '👼', '👮', '🕵', '💂', '👳', '🎅', '👸', '👰', '👲', '🙍', '🙇', '🚶', '🏃', '💃',
							'⛷', '🏂', '🏌', '🏄', '🚣', '🏊', '⛹', '🏋', '🚴', '👫', '💪', '👈', '👉', '👉', '👆', '🖕',
							'👇', '🖖', '🤘', '🖐', '👌', '👍', '👎', '✊', '👊', '👏', '🙌', '🙏', '🐵', '🐶', '🐇', '🐥',
							'🐸', '🐌', '🐛', '🐜', '🐝', '🍉', '🍄', '🍔', '🍤', '🍨', '🍪', '🎂', '🍰', '🍾', '🍷', '🍸',
							'🍺', '🌍', '🚑', '⏰', '🌙', '🌝', '🌞', '⭐', '🌟', '🌠', '🌨', '🌩', '⛄', '🔥', '🎄', '🎈',
							'🎉', '🎊', '🎁', '🎗', '🏀', '🏈', '🎲', '🔇', '🔈', '📣', '🔔', '🎵', '🎷', '💰', '🖊', '📅',
							'✅', '❎', '💯'
						]
					},
					embedded: {
						className: undefined,
						component: undefined,
						popupClassName: undefined,
						embedCallback: undefined,
						defaultSize: {
							height: 'auto',
							width: 'auto'
						}
					},
					image: {
						className: undefined,
						component: undefined,
						popupClassName: undefined,
						urlEnabled: true,
						uploadEnabled: true,
						alignmentEnabled: true,
						uploadCallback: undefined,
						previewImage: false,
						inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
						alt: { present: false, mandatory: false },
						defaultSize: {
							height: 'auto',
							width: 'auto'
						}
					},
					remove: { className: undefined, component: undefined },
					history: {
						inDropdown: false,
						className: undefined,
						component: undefined,
						dropdownClassName: undefined,
						options: ['undo', 'redo'],
						undo: { className: undefined },
						redo: { className: undefined }
					}
				}}
				localization={{
					locale: 'en'
				}}
		 		{...props}
			/>
}

TextEditor.propTypes = {
}

export default TextEditor
