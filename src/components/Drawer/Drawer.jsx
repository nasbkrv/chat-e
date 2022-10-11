import React, { useState } from 'react'
import { styled, useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import MuiDrawer from '@mui/material/Drawer'
import MuiAppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { Outlet, useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
import './Drawer.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faComments,
	faUser,
	faRightFromBracket
} from '@fortawesome/free-solid-svg-icons'
import { getAuth, signOut } from 'firebase/auth'
import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from '../../redux/features/user/userSlice'
import Loader from '../Loader/Loader'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { Avatar, TextField } from '@mui/material'
import NestedListItem from '../List/NestedListItem'
import { getAllUsers, getInitials } from '../../services/services'
import { Container } from '@mui/system'

const drawerWidth = 300

const openedMixin = (theme) => ({
	width: drawerWidth,
	transition: theme.transitions.create('width', {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.enteringScreen
	}),
	overflowX: 'hidden'
})

const closedMixin = (theme) => ({
	transition: theme.transitions.create('width', {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen
	}),
	overflowX: 'hidden',
	width: `calc(${theme.spacing(7)} + 1px)`,
	[theme.breakpoints.up('sm')]: {
		width: `calc(${theme.spacing(8)} + 1px)`
	}
})

const DrawerHeader = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'flex-end',
	padding: theme.spacing(0, 1),
	// necessary for content to be below app bar
	...theme.mixins.toolbar
}))

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
	zIndex: theme.zIndex.drawer + 1,
	transition: theme.transitions.create(['width', 'margin'], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen
	}),
	...(open && {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen
		})
	})
}))

const Drawer = styled(MuiDrawer, {
	shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
	width: drawerWidth,
	flexShrink: 0,
	whiteSpace: 'nowrap',
	boxSizing: 'border-box',
	...(open && {
		...openedMixin(theme),
		'& .MuiDrawer-paper': openedMixin(theme)
	}),
	...(!open && {
		...closedMixin(theme),
		'& .MuiDrawer-paper': closedMixin(theme)
	})
}))

function MiniDrawer({ children }) {
	const { loading } = useSelector((state) => state.loader)
	const {
		data: { friends, uid, username, photoURL, displayName }
	} = useSelector((state) => state.user)
	const theme = useTheme()
	const auth = getAuth()
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const [open, setOpen] = useState(true)
	const [searchFriends, setSearchFriends] = useState([])
	const [allUsers, setAllUsers] = useState([])

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
		signOut(auth).then(() => {
			dispatch(setUserData({}))
			localStorage.removeItem('at')
			navigate('/sign-in')
		})
	}
	async function handleFriendSearch(e) {
		const searchValue = e.target.value
		if (searchValue === '') {
			setSearchFriends([])
			return
		}
		if (allUsers.length === 0) {
			const res = await getAllUsers()
			if (res) {
				setAllUsers(res)
			}
		}
		const filtered = allUsers.filter(
			(obj) => obj.username.includes(searchValue) && obj.uid !== uid
		)
		if (filtered.length === 0 || searchValue === '') {
			setSearchFriends([])
		} else {
			setSearchFriends(filtered)
		}
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
							<Container maxWidth='fluid'>
								<Grid container spacing={2}>
									<Grid xs={12} md={10}>
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
									<Grid xs={12} md={2} display='flex' alignItems='center'>
										<Box padding='0 10px' display='flex' alignItems='center'>
											<Link
												className='profile-link'
												to={`/profile`}
												style={{ padding: '5px 15px', fontSize: 18 }}>
												{username}
											</Link>
											<Link className='profile-link' to={`/profile`}>
												{photoURL ? (
													<Avatar
														alt={getInitials(displayName)}
														src={photoURL}
													/>
												) : (
													<Avatar
														alt={getInitials(displayName)}
														sx={{ bgcolor: '#ffca28', color: '#21242e' }}>
														{getInitials(displayName)}
													</Avatar>
												)}
											</Link>
										</Box>
									</Grid>
								</Grid>
							</Container>
						</Toolbar>
					</AppBar>
					<Drawer variant='permanent' open={open} id='ce-side-nav'>
						<DrawerHeader>
							<IconButton onClick={handleDrawerClose}>
								{theme.direction === 'rtl' ? (
									<ChevronRightIcon />
								) : (
									<ChevronLeftIcon />
								)}
							</IconButton>
						</DrawerHeader>
						<Divider />
						<List className='nav-list'>
							{routes.map((route, index) => (
								<ListItem
									key={route.name}
									disablePadding
									sx={{ display: 'block' }}>
									<Link className='nav-link' to={route.path}>
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
									</Link>
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
					<Container maxWidth='fluid' style={{ height: 'calc(100% - 56px)' }}>
						<Box sx={{ flexGrow: 1, height: '100%' }}>
							<DrawerHeader />
							<Grid
								container
								spacing={2}
								maxWidth='fluid'
								style={{ height: '100%' }}>
								<Grid xs={12} md={10}>
									<div className='chatrooms-list'>{children}</div>
								</Grid>
								<Grid md={2} style={{ borderLeft: '1px solid #272727' }}>
									<div className='friends-list'>
										<TextField
											className='search-friends'
											label='Search for friends'
											variant='outlined'
											size='small'
											fullWidth
											onChange={handleFriendSearch}
										/>
										<Box>
											{searchFriends.map((user) => (
												<NestedListItem {...user} key={user.username} />
											))}
										</Box>
										{friends?.length === 0 ? (
											<Box padding='5px 15px'>
												<p>You currently have no friends :( </p>
											</Box>
										) : (
											''
										)}
									</div>
								</Grid>
							</Grid>
						</Box>
					</Container>
				</Box>
			)}
		</>
	)
}
export default MiniDrawer
