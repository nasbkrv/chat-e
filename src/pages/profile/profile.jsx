import { Box } from '@mui/system'
import './profile.scss'
import React, { useEffect, useState } from 'react'
import { Navigate, useLocation, useParams } from 'react-router'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import AvatarPhoto from '../../components/AvatarPhoto/AvatarPhoto'
import { getUserByUsername } from '../../services/services'
import { useSelector } from 'react-redux'
function Profile() {
	const [user, setUser] = useState(null)
	const { data: userData } = useSelector((state) => state.user)
	const { username: userParam } = useParams()
	const location = useLocation()
	document.title = user?.username
	useEffect(() => {
		async function fetchUser() {
			const [resUser] = await getUserByUsername(userParam)
			return resUser
		}
		if (userParam) {
			if (!location.state) {
				fetchUser().then((res) => setUser(res))
			} else {
				setUser(location.state)
			}
		} else {
			setUser(userData)
		}
	}, [location.state, userData, userParam])
	if (userParam === userData.username) {
		return <Navigate to='/profile' />
	}
	return (
		<Box className='profile-page'>
			{user && (
				<Grid container maxWidth='fluid'>
					<header className='profile-header'>
						<AvatarPhoto
							username={user.username}
							displayName={user.displayName}
							photoURL={user.photoURL}
							style={{ height: 180, width: 180 }}
						/>
						<h1>
							<span className='username-prefix'>@</span>
							{user.username}
						</h1>
					</header>
				</Grid>
			)}
		</Box>
	)
}

export default Profile
