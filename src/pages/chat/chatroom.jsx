import React, { useEffect, useRef, useState } from 'react'
import './chatroom.scss'
import { useLocation, useParams } from 'react-router'
import AvatarPhoto from '../../components/AvatarPhoto/AvatarPhoto'
import { Typography } from '@mui/material'
import { NavLink } from 'react-router-dom'
import TimeAgo from 'react-timeago'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faCheckDouble } from '@fortawesome/free-solid-svg-icons'
import ChatFooter from '../../components/ChatFooter/ChatFooter'
import {
	decryptMessage,
	getUserByUsername,
	openChatroom
} from '../../services/services'
import Loader from '../../components/Loader/Loader'
import { useSelector } from 'react-redux'
import { doc, onSnapshot } from 'firebase/firestore'
import db from '../../firebase/firebase'
function Chatroom() {
	// Current logged in user data
	const {
		data: { uid },
		data: userData
	} = useSelector((state) => state.user)
	const location = useLocation()
	const { username } = useParams()
	const ref = useRef()
	const [messages, setMessages] = useState(null)
	const [user, setUser] = useState(null)
	const date = new Date(Number(user?.lastLoginAt))
	const [chatRoomName, setChatRoomName] = useState('')
	useEffect(() => {
		ref?.current?.scrollIntoView({ behavior: 'smooth' })
		setChatRoomName([userData.username, user?.username].sort().join('&'))
		if (!location.state) {
			getUserByUsername(username).then(async (res) => {
				const [user] = res
				const chatroom = await openChatroom(userData, user)
				setUser(chatroom.user)
				setMessages(chatroom.messages)
			})
		} else {
			setUser(location.state.user)
			setMessages(location.state.messages)
		}
	}, [location.state, user?.username])
	useEffect(() => {
		if (chatRoomName) {
			const unsubscribe = onSnapshot(
				doc(db, 'chatrooms', chatRoomName),
				(snapshot) => {
					setMessages(snapshot.data().messages)
				}
			)
			return unsubscribe
		}
	}, [chatRoomName])
	return (
		<>
			{messages ? (
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
							{messages.map((message, index) => (
								<div className='message-wrap' key={index}>
									{message.sender.uid !== uid &&
										messages[index + 1]?.sender.uid !== message.sender.uid && (
											<AvatarPhoto
												className='avatar'
												username={message.sender.username}
												displayName={message.sender.displayName}
												photoURL={message.sender.photoURL}
											/>
										)}
									<div
										className={`chat-message ${
											message.sender.uid === uid ? 'me' : 'other'
										}`}>
										<Typography variant='body1' className='message'>
											<span
												dangerouslySetInnerHTML={{
													__html: decryptMessage(message.message)
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
						<ChatFooter chatroomId={chatRoomName} />
					</div>
				</div>
			) : (
				<Loader />
			)}
		</>
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
			'Hello2 <img class="emoji" src="https://cdn.jsdelivr.net/npm/emoji-datasource-twitter/img/twitter/64/1f60d.png"/>',
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
