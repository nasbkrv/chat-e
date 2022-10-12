import React, { useState } from 'react'
import './NestedListItem.scss'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Collapse from '@mui/material/Collapse'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import { Avatar, Divider } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faUserPlus,
	faIdCard,
	faUserXmark
} from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router'
import { getInitials } from '../../services/services'
import { useSelector } from 'react-redux'
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore'
import db from '../../firebase/firebase'
function NestedListItem({
	photoURL,
	username,
	displayName,
	uid: searchUid,
	requests
}) {
	const navigate = useNavigate()
	const { uid: currentUid } = useSelector((state) => state.user.data)
	const [open, setOpen] = useState(false)
	const [frReq, setFrReq] = useState(requests.includes(currentUid))
	function handleClick() {
		setOpen(!open)
	}
	async function sendFriendReq() {
		const userRef = doc(db, 'users', searchUid)
		await updateDoc(userRef, {
			requests: arrayUnion(currentUid)
		}).then(() => {
			setFrReq(true)
		})
	}
	async function cancelFriendReq() {
		const userRef = doc(db, 'users', searchUid)
		await updateDoc(userRef, {
			requests: arrayRemove(currentUid)
		}).then(() => {
			setFrReq(false)
		})
	}
	return (
		<List
			sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
			component='nav'
			aria-labelledby='nested-list-subheader'>
			<ListItemButton onClick={handleClick}>
				<ListItemIcon>
					{photoURL ? (
						<Avatar alt={getInitials(displayName)} src={photoURL} />
					) : (
						<Avatar
							alt='Remy Sharp'
							sx={{ bgcolor: '#ffca28', color: '#21242e' }}>
							{getInitials(displayName)}
						</Avatar>
					)}
				</ListItemIcon>
				<ListItemText primary={username} />
				{open ? <ExpandLess /> : <ExpandMore />}
			</ListItemButton>
			<Collapse in={open} timeout='auto' unmountOnExit>
				<List component='div' disablePadding className='user-search-list'>
					<ListItemButton
						onClick={frReq ? cancelFriendReq : sendFriendReq}
						className={`${frReq ? 'req-sent' : ''} list-item-btn`}>
						<FontAwesomeIcon
							icon={frReq ? faUserXmark : faUserPlus}
							style={{ marginRight: 15 }}
						/>
						<ListItemText primary={frReq ? 'Canel Request' : 'Add Friend'} />
					</ListItemButton>
					<Divider />
					<ListItemButton className='list-item-btn'>
						<FontAwesomeIcon icon={faIdCard} style={{ marginRight: 15 }} />
						<ListItemText
							primary='View Profile'
							onClick={() => {
								navigate(`/user/${username}`)
							}}
						/>
					</ListItemButton>
				</List>
			</Collapse>
		</List>
	)
}
export default NestedListItem
