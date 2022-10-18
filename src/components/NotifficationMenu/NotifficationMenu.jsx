import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  Button, Fade } from '@mui/material'
import { Box } from '@mui/system'
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import db from '../../firebase/firebase'
import { getInitials } from '../../services/services'
import AvatarPhoto from '../AvatarPhoto/AvatarPhoto'
import { StyledBadge, StyledNotifMenu } from '../Drawer/DrawerStyles'

function NotifficationMenu() {
	const {
		data: { requests, uid: recivingUid, displayName },
		data: curentUserData
	} = useSelector((state) => state.user)
	const [anchorEl, setAnchorEl] = useState(false)
	const openNotif = Boolean(anchorEl)
	const handleNotifShow = (event) => {
		setAnchorEl(event.currentTarget)
	}
	const handleNotifHide = () => {
		setAnchorEl(null)
	}
	// user == sending user
	async function acceptFriendReq(user) {
		const recivingUserRef = doc(db, 'users', recivingUid)
		const recivingUserDoc = await getDoc(recivingUserRef)
		// Get requests array and filter it out of current user
		const requests = recivingUserDoc
			.data()
			.requests.filter((obj) => obj.uid !== user.uid)
		await updateDoc(recivingUserRef, {
			friends: arrayUnion(user.uid),
			requests: requests
		})
		const sendingUserRef = doc(db, 'users', user.uid)
		await updateDoc(sendingUserRef, {
			friends: arrayUnion(curentUserData.uid)
		})
	}
	async function declineFriendReq(user) {
		const recivingUserRef = doc(db, 'users', recivingUid)
		const recivingUserDoc = await getDoc(recivingUserRef)
		// Get requests array and filter it out of current user
		const requests = recivingUserDoc
			.data()
			.requests.filter((obj) => obj.uid !== user.uid)
		console.log(requests)
		await updateDoc(recivingUserRef, {
			requests: requests
		})
	}
	return (
		<>
			<Button
				id='fade-button'
				aria-controls={openNotif ? 'fade-menu' : undefined}
				aria-haspopup='true'
				aria-expanded={openNotif ? 'true' : undefined}
				onClick={handleNotifShow}>
				{requests.length > 0 ? (
					<StyledBadge badgeContent={requests.length} color='secondary'>
						<FontAwesomeIcon icon={faEnvelope} color='#ffca28' fontSize={20} />
					</StyledBadge>
				) : (
					<FontAwesomeIcon icon={faEnvelope} color='#ffca28' fontSize={20} />
				)}
			</Button>
			<StyledNotifMenu
				className='friend-req-notif'
				MenuListProps={{
					'aria-labelledby': 'fade-button'
				}}
				anchorEl={anchorEl}
				open={openNotif}
				transformOrigin={{
					vertical: 'top',
					horizontal: 180
				}}
				onClose={handleNotifHide}
				TransitionComponent={Fade}>
				{requests.length > 0 ? (
					requests.map((user) => (
						<Box
							key={user.username}
							display='flex'
							alignItems='center'
							padding='5px 15px'>
							<AvatarPhoto
								username={user.username}
								displayName={displayName}
								alt={getInitials(user.displayName, user.username)}
								src={user.photoURL}
								sx={{ width: 56, height: 56 }}
							/>
							<Box marginLeft={2}>
								<Box component='p' margin={0}>
									{user.username}
								</Box>
								<Box className='btns-wrap'>
									<Button
										onClick={() => acceptFriendReq(user)}
										size='small'
										className='btn-accept'
										variant='contained'>
										Accept
									</Button>
									<Button
										onClick={() => declineFriendReq(user)}
										size='small'
										className='btn-decline'
										variant='outlined'>
										Decline
									</Button>
								</Box>
							</Box>
						</Box>
					))
				) : (
					<Box
						display='flex'
						alignItems='center'
						justifyContent='center'
						padding='5px 15px'
						textAlign='center'>
						Nothing new is happening
					</Box>
				)}
			</StyledNotifMenu>
		</>
	)
}

export default NotifficationMenu
