import React, { forwardRef, useEffect, useRef } from 'react'
import ReactDOMServer from 'react-dom/server'
import ContentEditable from 'react-contenteditable'
import EmojiPicker from '../EmojiPicker/EmojiPicker'
import Picker from 'emoji-picker-react'
import { useTheme } from '@emotion/react'
import { Button } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

function useOutsideAlerter(ref) {
	useEffect(() => {
		/**
		 * Alert if clicked on outside of element
		 */
		function handleClickOutside(event) {
      console.log(event.target)
			if (ref.current && !ref.current.contains(event.target)) {
				document.querySelector('.custom-emoji-picker').classList.remove('show')
			}
		}
		// Bind the event listener
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			// Unbind the event listener on clean up
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [ref])
}
function ChatFooter() {
	const htmlRef = useRef('')
	const emojiPickerRef = useRef()
	const handleInputChange = (e) => {
		htmlRef.current = e.target.value
	}
	function emojiClicked(emojiData) {
		document.querySelector(
			'#editable'
		).innerHTML += ` ${ReactDOMServer.renderToStaticMarkup(
			<img
				className='emoji'
				src={emojiData.getImageUrl('twitter')}
				alt={emojiData.emoji}
				style={{ margin: '0 2px' }}
			/>
		)} `
	}
	function sendMessage(e) {
		e.preventDefault()
	}
  useOutsideAlerter(emojiPickerRef)
	const CustomEmojiPicker = forwardRef((props, ref) => {
		return (
			<div ref={ref} className='custom-emoji-picker'>
				<Picker
					theme={useTheme().palette.mode}
					emojiStyle='twitter'
					autoFocusSearch={false}
					lazyLoadEmojis={true}
					suggestedEmojisMode='recent'
					onEmojiClick={emojiClicked}
				/>
			</div>
		)
	})
	return (
		<div className='chat-footer'>
			<div className='input-warp'>
				<ContentEditable
					contentEditable='true'
					html={htmlRef.current}
					id='editable'
					onChange={handleInputChange}
					suppressContentEditableWarning={true}
					tagName='span'
				/>
				<label htmlFor='#editable'>Message</label>
			</div>

			<div className='emoji-wrap'>
				<EmojiPicker />
				<CustomEmojiPicker ref={emojiPickerRef} />
			</div>
			<Button
				variant='contained'
				color='primary'
				className='send-btn'
				size='small'
				onClick={sendMessage}>
				Send
				<FontAwesomeIcon
					icon={faArrowRight}
					style={{ margin: '0 3px', display: 'inline-block' }}
				/>
			</Button>
		</div>
	)
}

export default ChatFooter
