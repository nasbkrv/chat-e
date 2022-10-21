import React, { useEffect, useState } from 'react'
import { Emoji } from 'emoji-picker-react'

function EmojiPicker() {
	const [icon, setIcon] = useState('1f604')
	function showPicker() {
		const emojiPicker = document.querySelector('.custom-emoji-picker')
		emojiPicker.classList.toggle('show')
	}

	useEffect(() => {
		const interval = setInterval(() => {
			const index = Math.floor(Math.random() * icons.length)
			setIcon(icons[index])
		}, 1500)

		return () => {
			clearInterval(interval)
		}
	}, [])

	return (
		<div>
			<div className='emoji-show' onClick={showPicker}>
				<Emoji unified={icon} size='25' emojiStyle='twitter' />
			</div>
		</div>
	)
}
const icons = [
	'1f60a',
	'1f601',
	'1f609',
	'1f911',
	'1f637',
	'1f92f',
	'1f92d',
	'1f92b',
	'1f92c',
	'1f92e',
	'1f92a',
	'1f928',
	'1f610',
	'1f611',
	'1f636',
	'1f644',
	'1f60f',
	'1f623',
	'1f625',
	'1f62e',
	'1f910',
	'1f62f',
	'1f62a',
	'1f62b',
	'1f634',
	'1f60d',
	'1f913',
	'1f914',
	'1f615',
	'1f61d',
	'1f61c',
	'1f61e',
	'1f620',
	'1f621',
	'1f624',
	'1f616',
	'1f606',
	'1f60b',
	'1f60e',
	'1f618',
	'1f617',
	'1f619',
	'1f61a',
	'1f61b',
	'1f633',
	'1f635',
	'1f632',
	'1f61f',
	'1f626',
	'1f627',
	'1f628',
	'1f629',
	'1f62d',
	'1f630',
	'1f631'
]
export default EmojiPicker
