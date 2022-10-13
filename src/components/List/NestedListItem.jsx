import React, { useState } from 'react'
import './NestedListItem.scss'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Collapse from '@mui/material/Collapse'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import { Divider } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faUserPlus,
	faIdCard,
	faUserXmark
} from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore'
import db from '../../firebase/firebase'
import AvatarPhoto from '../AvatarPhoto/AvatarPhoto'
function NestedListItem(props) {
	const { photoURL, username, displayName, uid: searchUid, requests } = props
	const navigate = useNavigate()
	const {
		data: { uid: currentUid },
		data: currentUserData
	} = useSelector((state) => state.user)
	const [open, setOpen] = useState(false)
	const [frReq, setFrReq] = useState(
		requests.some((obj) => obj.uid === currentUid)
	)
	function handleClick() {
		setOpen(!open)
	}
	async function sendFriendReq() {
		const userRef = doc(db, 'users', searchUid)
		await updateDoc(userRef, {
			requests: arrayUnion(currentUserData)
		}).then(() => {
			setFrReq(true)
		})
	}
	async function cancelFriendReq() {
		const userRef = doc(db, 'users', searchUid)
		const userDoc = await getDoc(userRef)
		// Get requests array and filter it out of current user
		const requests = userDoc
			.data()
			.requests.filter((obj) => obj.uid !== currentUid)
		await updateDoc(userRef, {
			requests: requests
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
					<AvatarPhoto displayName={displayName} photoURL={photoURL} />
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
					<ListItemButton
						className='list-item-btn'
						onClick={() => {
							navigate(`/user/${username}`, { state: props })
						}}>
						<FontAwesomeIcon icon={faIdCard} style={{ marginRight: 15 }} />
						<ListItemText primary='View Profile' />
					</ListItemButton>
				</List>
			</Collapse>
		</List>
	)
}
export default NestedListItem
