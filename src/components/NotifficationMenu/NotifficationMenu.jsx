import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Avatar, Button, Fade } from '@mui/material'
import { Box } from '@mui/system'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { getInitials } from '../../services/services'
import { StyledBadge, StyledNotifMenu } from '../Drawer/DrawerStyles'

function NotifficationMenu() {
	const { requests } = useSelector((state) => state.user.data)
	const [anchorEl, setAnchorEl] = useState(false)
	const openNotif = Boolean(anchorEl)
	const handleNotifShow = (event) => {
		setAnchorEl(event.currentTarget)
	}
	const handleNotifHide = () => {
		setAnchorEl(null)
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
							<Avatar
								alt={getInitials(user.displayName)}
								src={user.photoURL}
								sx={{ width: 56, height: 56 }}
							/>
							<Box marginLeft={2}>
								<Box component='p' margin={0}>
									{user.username}
								</Box>
								<Box className='btns-wrap'>
									<Button
										size='small'
										className='btn-accept'
										variant='contained'>
										Accept
									</Button>
									<Button
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
