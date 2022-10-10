import React from 'react'
import { useSelector } from 'react-redux'

function Homepage() {
	const {
		user: { chatrooms }
	} = useSelector((state) => state.user)
	return (
		<div className='chatrooms-list'>
			{chatrooms.length === 0 ? (
				<h2>No chat rooms found. Open a chat room with a friend now.</h2>
			) : (
				''
			)}
		</div>
	)
}

export default Homepage
