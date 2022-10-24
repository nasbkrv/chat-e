import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { useNavigate } from 'react-router'
import { Link, NavLink } from 'react-router-dom'
import './Drawer.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faComments,
	faUser,
	faRightFromBracket
} from '@fortawesome/free-solid-svg-icons'
import { getAuth, signOut } from 'firebase/auth'
import { connect } from 'react-redux'
import { setUserData } from '../../redux/features/user/userSlice'
import Loader from '../Loader/Loader'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { TextField } from '@mui/material'
import NestedListItem from '../List/NestedListItem'
import { getAllUsers, getUserById, openChatroom } from '../../services/services'
import { Container } from '@mui/system'
import { DrawerHeader, Drawer, AppBar } from './DrawerStyles'
import {
	collection,
	documentId,
	onSnapshot,
	query,
	where
} from 'firebase/firestore'
import db from '../../firebase/firebase'
import Header from './Header'
import AvatarPhoto from '../AvatarPhoto/AvatarPhoto'
import { setLoading } from '../../redux/features/loader/loaderSlice'
import FriendsList from '../FriendsList/FriendsList'

function MiniDrawer({
	loader: { loading },
	user: {
		data: {
			friends: friendsIds,
			uid,
			username,
			photoURL,
			displayName,
			requests
		}
	},
	dispatch,
	children,
	user: { data: userData }
}) {
	const auth = getAuth()
	const [open, setOpen] = useState(true)

	const navigate = useNavigate()
	const routes = [
		{
			path: '/',
			name: 'Chatrooms',
			icon: faComments
		},
		{
			path: '/profile',
			name: 'Profile',
			icon: faUser
		}
	]
	const handleDrawerOpen = () => {
		setOpen(true)
	}
	const handleDrawerClose = () => {
		setOpen(false)
	}
	function handleLogout() {
		navigate('/sign-in')
		localStorage.removeItem('at')
		signOut(auth)
		dispatch(setUserData({}))
	}

	return (
		<>
			{loading ? (
				<Loader />
			) : (
				<Box sx={{ display: 'flex', height: '100%' }}>
					<AppBar position='fixed' open={open}>
						<Toolbar>
							<IconButton
								color='inherit'
								aria-label='open drawer'
								onClick={handleDrawerOpen}
								edge='start'
								sx={{
									marginRight: 5,
									...(open && { display: 'none' })
								}}>
								<MenuIcon />
							</IconButton>
							<Header />
						</Toolbar>
					</AppBar>
					<Drawer variant='permanent' open={open} id='ce-side-nav'>
						<DrawerHeader>
							<IconButton onClick={handleDrawerClose}>
								<ChevronLeftIcon />
							</IconButton>
						</DrawerHeader>
						<Divider />
						<List className='nav-list'>
							{routes.map((route, index) => (
								<ListItem
									key={route.name}
									disablePadding
									sx={{ display: 'block' }}>
									<NavLink to={route.path} className='nav-link' end>
										<ListItemButton sx={{ minHeight: '48px' }}>
											<FontAwesomeIcon
												icon={route.icon}
												style={{
													minWidth: open ? '50px' : '20px',
													margin: '0 auto'
												}}
											/>
											{open && (
												<ListItemText
													primary={route.name}
													sx={{ opacity: open ? 1 : 0 }}
												/>
											)}
										</ListItemButton>
									</NavLink>
								</ListItem>
							))}
						</List>
						<Divider />
						<List className='nav-list'>
							<ListItem
								disablePadding
								sx={{ display: 'block' }}
								onClick={handleLogout}>
								<Link className='nav-link'>
									<ListItemButton sx={{ minHeight: '48px' }}>
										<FontAwesomeIcon
											icon={faRightFromBracket}
											style={{
												minWidth: open ? '50px' : '20px',
												transform: 'scaleX(-1)',
												margin: '0 auto'
											}}
										/>
										{open && (
											<ListItemText
												primary={'Logout'}
												sx={{ opacity: open ? 1 : 0 }}
											/>
										)}
									</ListItemButton>
								</Link>
							</ListItem>
						</List>
					</Drawer>
					<Container
						maxWidth='fluid'
						style={{ height: 'calc(100% - 56px)' }}
						disableGutters>
						<Box sx={{ flexGrow: 1, height: '100%' }}>
							<DrawerHeader />
							<Grid container maxWidth='fluid' style={{ height: '98%' }}>
								<Grid xs={9}>
									<div className='main-nav-window'>{children}</div>
								</Grid>
								<FriendsList />
							</Grid>
						</Box>
					</Container>
				</Box>
			)}
		</>
	)
}
const mapStateToProps = (state) => {
	return state
}
export default connect(mapStateToProps)(MiniDrawer)
