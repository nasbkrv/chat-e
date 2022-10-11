import React, { useState } from 'react'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Collapse from '@mui/material/Collapse'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import { Avatar } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus, faIdCard } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router'
import { getInitials } from '../../services/services'
function NestedListItem({ photoURL, username, displayName }) {
	const navigate = useNavigate()
	const [open, setOpen] = useState(false)

	function handleClick() {
		setOpen(!open)
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
				<List component='div' disablePadding>
					<ListItemButton sx={{ pl: 4 }}>
						<FontAwesomeIcon icon={faUserPlus} style={{ marginRight: 15 }} />
						<ListItemText primary='Add Friend' />
					</ListItemButton>
					<ListItemButton sx={{ pl: 4 }}>
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
