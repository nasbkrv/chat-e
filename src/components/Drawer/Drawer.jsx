import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
import './Drawer.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faComments,
	faUser,
	faRightFromBracket,
	faEnvelope
} from '@fortawesome/free-solid-svg-icons'
import { getAuth, signOut } from 'firebase/auth'
import { connect } from 'react-redux'
import { setUserData } from '../../redux/features/user/userSlice'
import Loader from '../Loader/Loader'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { Avatar, TextField } from '@mui/material'
import NestedListItem from '../List/NestedListItem'
import { getAllUsers, getInitials } from '../../services/services'
import { Container } from '@mui/system'
import { DrawerHeader, Drawer, AppBar, StyledBadge } from './DrawerStyles'
import {
	collection,
	doc,
	documentId,
	getDocs,
	onSnapshot,
	query,
	where
} from 'firebase/firestore'
import db from '../../firebase/firebase'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import Fade from '@mui/material/Fade'

function MiniDrawer({
	loader: { loading },
	user: {
		data: { friends, uid, username, photoURL, displayName, requests }
	},
	dispatch,
	children
}) {
	const auth = getAuth()
	const [open, setOpen] = useState(true)
	const [searchFriends, setSearchFriends] = useState([])
	const [allUsers, setAllUsers] = useState([])
	const [requestsUsers, setRequestsUsers] = useState([])
	const [anchorEl, setAnchorEl] = useState(false)
	const openNotif = Boolean(anchorEl)
	const navigate = useNavigate()
	const handleNotifShow = (event) => {
		setAnchorEl(event.currentTarget)
	}
	const handleNotifHide = () => {
		setAnchorEl(null)
	}
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
	useEffect(() => {
		async function fetchUsers() {
			const q = query(
				collection(db, 'users'),
				where(documentId(), 'in', requests)
			)
			await getDocs(q).then((res) => {
				res.docs.forEach((doc) => {
					setRequestsUsers((prevState) => [...prevState, doc.data()])
				})
			})
		}
		if (requests?.length > 0) {
			if (requestsUsers.length === 0) fetchUsers()
		}
		if (uid) {
			const userRef = doc(db, 'users', uid)
			const unsubscribe = onSnapshot(userRef, (doc) => {
				dispatch(setUserData(doc.data()))
			})
			return () => {
				unsubscribe()
			}
		}
	}, [uid, dispatch, requests, requestsUsers.length])

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
											<Link
												className='profile-link'
												to={`/profile`}
												style={{ padding: '5px 15px', fontSize: 18 }}>
												{username}
											</Link>
											<Button
												id='fade-button'
												aria-controls={openNotif ? 'fade-menu' : undefined}
												aria-haspopup='true'
												aria-expanded={openNotif ? 'true' : undefined}
												onClick={handleNotifShow}>
												{requests.length > 0 ? (
													<StyledBadge
														badgeContent={requests.length}
														color='secondary'>
														<FontAwesomeIcon
															icon={faEnvelope}
															color='#ffca28'
															fontSize={20}
														/>
													</StyledBadge>
												) : (
													<FontAwesomeIcon
														icon={faEnvelope}
														color='#ffca28'
														fontSize={20}
													/>
												)}
											</Button>
											<Menu
												className='friend-req-notif'
												MenuListProps={{
													'aria-labelledby': 'fade-button'
												}}
												anchorEl={anchorEl}
												open={openNotif}
												onClose={handleNotifHide}
												TransitionComponent={Fade}>
												{requestsUsers.map((user) => (
													<Box
														key={user.username}
														display='flex'
														alignItems='center'
														padding='5px 15px'>
														<Avatar
															alt={getInitials(displayName)}
															src={photoURL}
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
												))}
											</Menu>
										</Box>
									</Grid>
								</Grid>
							</Container>
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
								<Grid xs={12} md={9}>
									<div className='chatrooms-list'>{children}</div>
								</Grid>
								<Grid md={3} style={{ borderLeft: '1px solid #272727' }}>
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
const mapStateToProps = (state) => {
	return state
}
export default connect(mapStateToProps)(MiniDrawer)
