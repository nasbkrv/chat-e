import React, { useEffect, useRef } from 'react'
import './chatroom.scss'
import { useLocation } from 'react-router'
import AvatarPhoto from '../../components/AvatarPhoto/AvatarPhoto'
import {  Typography } from '@mui/material'
import { NavLink } from 'react-router-dom'
import TimeAgo from 'react-timeago'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faCheckDouble } from '@fortawesome/free-solid-svg-icons'
import ChatFooter from '../../components/ChatFooter/ChatFooter'

function Chatroom() {
	const {
		state: { user }
	} = useLocation()
	const ref = useRef()
	const date = new Date(Number(user.lastLoginAt))

	useEffect(() => {
		ref.current.scrollIntoView({ behavior: 'smooth' })
	}, [])
	return (
		<div id='chat-wrap'>
			<div className='chat-header'>
				<NavLink to={`/user/${user.username}`}>
					<AvatarPhoto
						username={user.username}
						displayName={user.displayName}
						photoURL={user.photoURL}
						style={{ width: 60, height: 60, marginRight: '20px' }}
					/>
				</NavLink>
				<div className='name-date-wrap'>
					<NavLink to={`/user/${user.username}`}>
						<Typography variant='h5'>{user.username}</Typography>
					</NavLink>
					<span className='last-seen'>
						Last seen: <TimeAgo date={date} />
					</span>
				</div>
			</div>
			<div className='chat-body-footer'>
				<div className='chat-body' style={{ transform: 'scaleY(1)' }}>
					{chatMessages.map((message, index) => (
						<div className='message-wrap' key={index}>
							{message.sender.uid !== '456' &&
								chatMessages[index + 1]?.sender.uid !== message.sender.uid && (
									<AvatarPhoto
										className='avatar'
										username={message.sender.username}
										displayName={message.sender.displayName}
										photoURL={message.sender.photoURL}
									/>
								)}
							<div
								className={`chat-message ${
									message.sender.uid === '456' ? 'me' : 'other'
								}`}>
								<Typography variant='body1' className='message'>
									<span
										dangerouslySetInnerHTML={{
											__html: message.message
										}}></span>
								</Typography>

								<span className='time'>
									<TimeAgo date={new Date(Number(message.createdAt))} />
								</span>

								<span className='status'>
									{message.status === 'sent' && (
										<FontAwesomeIcon icon={faCheck} />
									)}
									{message.status === 'delivered' && (
										<FontAwesomeIcon icon={faCheckDouble} />
									)}
									{message.status === 'read' && (
										<FontAwesomeIcon icon={faCheckDouble} />
									)}
								</span>
							</div>
						</div>
					))}
					<div className='ref' ref={ref}></div>
				</div>
				<ChatFooter />
			</div>
		</div>
	)
}
const chatMessages = [
	{
		message: 'Hello',
		status: 'sent',
		photoURL: 'https://randomuser.me/api/portraits/lego/1.jpg',
		uid: '123',
		sender: {
			displayName: 'John Doe',
			photoURL: 'https://randomuser.me/api/portraits/lego/1.jpg',
			uid: '123',
			username: 'johndoe',
			createdAt: 1666089981000
		},
		createdAt: 1666089981000
	},
	{
		message: 'Hello',
		status: 'sent',
		photoURL: 'https://randomuser.me/api/portraits/lego/1.jpg',
		uid: '123',
		sender: {
			displayName: 'John Doe',
			photoURL: 'https://randomuser.me/api/portraits/lego/1.jpg',
			uid: '456',
			username: 'johndoe',
			createdAt: 1666089981000
		},
		createdAt: 1666089981000
	},
	{
		message: 'Hello',
		status: 'sent',
		photoURL: 'https://randomuser.me/api/portraits/lego/1.jpg',
		uid: '123',
		sender: {
			displayName: 'John Doe',
			photoURL: 'https://randomuser.me/api/portraits/lego/1.jpg',
			uid: '123',
			username: 'johndoe',
			createdAt: 1666089981000
		},
		createdAt: 1666089981000
	},
	{
		message: 'Hello',
		status: 'sent',
		photoURL: 'https://randomuser.me/api/portraits/lego/1.jpg',
		uid: '123',
		sender: {
			displayName: 'John Doe',
			photoURL: 'https://randomuser.me/api/portraits/lego/1.jpg',
			uid: '123',
			username: 'johndoe',
			createdAt: 1666089981000
		},
		createdAt: 1666089981000
	},
	{
		message: 'Hello',
		status: 'sent',
		photoURL: 'https://randomuser.me/api/portraits/lego/1.jpg',
		uid: '123',
		sender: {
			displayName: 'John Doe',
			photoURL: 'https://randomuser.me/api/portraits/lego/1.jpg',
			uid: '123',
			username: 'johndoe',
			createdAt: 1666089981000
		},
		createdAt: 1666089981000
	},
	{
		message: 'Hello',
		status: 'sent',
		photoURL: 'https://randomuser.me/api/portraits/lego/1.jpg',
		uid: '123',
		sender: {
			displayName: 'John Doe',
			photoURL: 'https://randomuser.me/api/portraits/lego/1.jpg',
			uid: '123',
			username: 'johndoe',
			createdAt: 1666089981000
		},
		createdAt: 1666089981000
	},
	{
		message: 'Hello',
		status: 'sent',
		photoURL: 'https://randomuser.me/api/portraits/lego/1.jpg',
		uid: '123',
		sender: {
			displayName: 'John Doe',
			photoURL: 'https://randomuser.me/api/portraits/lego/1.jpg',
			uid: '123',
			username: 'johndoe',
			createdAt: 1666089981000
		},
		createdAt: 1666089981000
	},
	{
		message: 'Hello',
		status: 'sent',
		photoURL: 'https://randomuser.me/api/portraits/lego/1.jpg',
		uid: '123',
		sender: {
			displayName: 'John Doe',
			photoURL: 'https://randomuser.me/api/portraits/lego/1.jpg',
			uid: '123',
			username: 'johndoe',
			createdAt: 1666089981000
		},
		createdAt: 1666089981000
	},
	{
		message: 'Hello',
		status: 'sent',
		photoURL: 'https://randomuser.me/api/portraits/lego/1.jpg',
		uid: '123',
		sender: {
			displayName: 'John Doe',
			photoURL: 'https://randomuser.me/api/portraits/lego/1.jpg',
			uid: '123',
			username: 'johndoe',
			createdAt: 1666089981000
		},
		createdAt: 1666089981000
	},
	{
		message: 'Hello',
		status: 'sent',
		photoURL: 'https://randomuser.me/api/portraits/lego/1.jpg',
		uid: '123',
		sender: {
			displayName: 'John Doe',
			photoURL: 'https://randomuser.me/api/portraits/lego/1.jpg',
			uid: '123',
			username: 'johndoe',
			createdAt: 1666089981000
		},
		createdAt: 1666089981000
	},
	{
		message: 'Hello',
		status: 'sent',
		photoURL: 'https://randomuser.me/api/portraits/lego/1.jpg',
		uid: '123',
		sender: {
			displayName: 'John Doe',
			photoURL: 'https://randomuser.me/api/portraits/lego/1.jpg',
			uid: '123',
			username: 'johndoe',
			createdAt: 1666089981000
		},
		createdAt: 1666089981000
	},
	{
		message: 'Hello',
		status: 'sent',
		photoURL: 'https://randomuser.me/api/portraits/lego/1.jpg',
		uid: '123',
		sender: {
			displayName: 'John Doe',
			photoURL: 'https://randomuser.me/api/portraits/lego/1.jpg',
			uid: '123',
			username: 'johndoe',
			createdAt: 1666089981000
		},
		createdAt: 1666089981000
	},
	{
		message: 'Hello',
		status: 'sent',
		photoURL: 'https://randomuser.me/api/portraits/lego/1.jpg',
		uid: '123',
		sender: {
			displayName: 'John Doe',
			photoURL: 'https://randomuser.me/api/portraits/lego/1.jpg',
			uid: '123',
			username: 'johndoe',
			createdAt: 1666089981000
		},
		createdAt: 1666089981000
	},
	{
		message: 'Hello3',
		status: 'sent',
		photoURL: 'https://randomuser.me/api/portraits/lego/1.jpg',
		uid: '123',
		sender: {
			displayName: 'John Doe',
			photoURL: 'https://randomuser.me/api/portraits/lego/1.jpg',
			uid: '123',
			username: 'johndoe',
			createdAt: 1666089981000
		},
		createdAt: 1666089981000
	},
	{
		message:
			'Hello2 <img class="emoji" src="https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f60d.png"/>',
		status: 'delivered',
		photoURL: 'https://randomuser.me/api/portraits/lego/1.jpg',
		uid: '123',
		sender: {
			displayName: 'John Doe',
			photoURL: 'https://randomuser.me/api/portraits/lego/1.jpg',
			uid: '456',
			username: 'johndoe',
			createdAt: 1666089981000
		},
		createdAt: 1666089981000
	}
]

export default Chatroom
