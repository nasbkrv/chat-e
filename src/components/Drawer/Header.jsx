import React from 'react'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { Container } from '@mui/system'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

import AvatarPhoto from '../AvatarPhoto/AvatarPhoto'
import NotifficationMenu from '../NotifficationMenu/NotifficationMenu'

function Header() {
	const {
		data: userData,
		data: { username, displayName, photoURL }
	} = useSelector((state) => state.user)
	return (
		<Container maxWidth='fluid' className="big-container">
			<Grid container spacing={2}>
				<Grid xs={9}>
					<Typography variant='h6' noWrap component='div'>
						<Box
							component='span'
							color={'#ffca28'}
							fontSize={30}
							className='logo-font'>
							Chat-E
						</Box>
					</Typography>
				</Grid>
				<Grid xs={3} display='flex' alignItems='center'>
					<Box padding='0 10px' display='flex' alignItems='center'>
						<NavLink className='profile-link' to={`/profile`} state={userData}>
							<AvatarPhoto
								username={username}
								displayName={displayName}
								photoURL={photoURL}
							/>
						</NavLink>
						<NavLink
							className='profile-link'
							to={`/profile`}
							state={userData}
							style={{ padding: '5px 15px', fontSize: 18 }}>
							{username}
						</NavLink>
						<NotifficationMenu />
					</Box>
				</Grid>
			</Grid>
		</Container>
	)
}

export default Header
