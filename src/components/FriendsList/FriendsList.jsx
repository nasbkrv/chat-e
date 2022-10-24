import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { TextField } from '@mui/material'
import { Box } from '@mui/system'
import NestedListItem from '../List/NestedListItem'
import AvatarPhoto from '../AvatarPhoto/AvatarPhoto'
import { useDispatch, useSelector } from 'react-redux'
import { getAllUsers, getUserById, openChatroom } from '../../services/services'
import {
	collection,
	documentId,
	onSnapshot,
	query,
	where
} from 'firebase/firestore'
import db from '../../firebase/firebase'
import { setUserData } from '../../redux/features/user/userSlice'
import { useLocation, useNavigate } from 'react-router'

function FriendsList() {
	const {
		data: { friends: friendsIds, uid },
		data: userData
	} = useSelector((state) => state.user)
	const [searchFriends, setSearchFriends] = useState([])
	const [allUsers, setAllUsers] = useState([])
	const [noSearchFound, setNoSearchFound] = useState(false)
	const [friends, setFriends] = useState([])
	const dispatch = useDispatch()
	const navigate = useNavigate()
	async function handleFriendSearch(e) {
		const searchValue = e.target.value
		if (searchValue === '') {
			setSearchFriends([])
			setNoSearchFound(false)
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
			setNoSearchFound(true)
		} else {
			setSearchFriends(filtered)
			setNoSearchFound(false)
		}
	}
	useEffect(() => {
		if (uid) {
			const userRef = query(
				collection(db, 'users'),
				where(documentId(), '==', uid)
			)
			const friendsArr = []
			friendsIds.forEach(async (friendId) => {
				const res = await getUserById(friendId)
				if (res && !friendsArr.some((friend) => friend.uid !== friendId)) {
					friendsArr.push(res)
				}
			})
			if (friends.length === 0) {
				setFriends(friendsArr)
			}

			const unsubscribe = onSnapshot(userRef, (snapshot) => {
				snapshot.docChanges().forEach((change) => {
					dispatch(setUserData(change.doc.data()))
				})
			})
			return () => unsubscribe()
		}
	}, [dispatch, uid, friends])
	return (
		<Grid xs={3} style={{ borderLeft: '1px solid #272727' }}>
			<div className='friends-list'>
				<TextField
					className='search-friends'
					label='Search for friends'
					variant='outlined'
					fullWidth
					size='small'
					onChange={handleFriendSearch}
				/>
				<Box className='search-users-wrap'>
					{searchFriends.map((user) => (
						<NestedListItem {...user} key={user.username} />
					))}
				</Box>
				{noSearchFound && (
					<Box padding='5px 15px'>
						<p>404: User not found!</p>
					</Box>
				)}
				<h4
					style={{
						borderBottom: '1px solid #ffffff60',
						paddingBottom: 3
					}}>
					Friends list:
				</h4>
				{friendsIds?.length === 0 ? (
					<Box padding='5px 15px'>
						<p>You currently have no friends :( </p>
					</Box>
				) : (
					<Box className='friend-list-wrap'>
						{friends.map((friend) => (
							<div
								className='friend-card'
								key={friend.username}
								onClick={() =>
									openChatroom(userData, friend).then((res) => {
										navigate(`/chat/${friend.username}`, {
											state: res
										})
									})
								}>
								<AvatarPhoto
									className='friend-item'
									{...friend}
									style={{ height: 60, width: 60 }}
								/>
								<div>{friend.username}</div>
							</div>
						))}
					</Box>
				)}
			</div>
		</Grid>
	)
}

export default FriendsList
