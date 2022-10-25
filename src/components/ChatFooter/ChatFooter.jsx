import React, { forwardRef, useEffect, useRef } from 'react'
import ReactDOMServer from 'react-dom/server'
import ContentEditable from 'react-contenteditable'
import EmojiPicker from '../EmojiPicker/EmojiPicker'
import Picker from 'emoji-picker-react'
import { useTheme } from '@emotion/react'
import { Button } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { encryptMessage } from '../../services/services'
import { arrayUnion, doc, updateDoc } from 'firebase/firestore'
import db from '../../firebase/firebase'
import { useSelector } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
function useOutsideAlerter(ref) {
	useEffect(() => {
		// Check if user clicks outside emoji picker
		function handleClickOutside(event) {
			if (ref.current && !ref.current.contains(event.target)) {
				document.querySelector('.custom-emoji-picker').classList.remove('show')
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [ref])
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
function ChatFooter({ chatroomId }) {
	const { uid, username } = useSelector((state) => state.user.data)
	const htmlRef = useRef('')
	const emojiPickerRef = useRef()
	const handleInputChange = (e) => {
		htmlRef.current = e.target.value
	}
	useOutsideAlerter(emojiPickerRef)
	async function sendMessage(e) {
		e.preventDefault()
		const inputMessage = document.getElementById('editable').innerHTML
		const encryptedMessage = encryptMessage(inputMessage)
		const chatRoomRef = doc(db, 'chatrooms', chatroomId)
		updateDoc(chatRoomRef, {
			messages: arrayUnion({
				message: encryptedMessage,
				messageId: uuidv4(),
				status: 'sent',
				createdAt: Date.now(),
				sender: {
					uid: uid,
					username: username
				}
			}),
			seen:false,
			lastUpdated: Date.now()
		})
			.then((res) => {
				console.log('Written to db')
			})
			.catch((err) => {
				console.error(err)
			})
		htmlRef.current = ''
	}
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
