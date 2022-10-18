import { Avatar } from '@mui/material'
import React from 'react'
import { getInitials } from '../../services/services'

function AvatarPhoto({ photoURL, displayName, username, style, className }) {
	return (
		<div className={className}>
			{photoURL ? (
				<Avatar
					alt={getInitials(displayName, username)}
					src={photoURL}
					sx={{ bgcolor: '#ffca28', color: '#21242e' ,...style}}
				/>
			) : (
				<Avatar
					alt={displayName || username}
					sx={{ bgcolor: '#ffca28', color: '#21242e',...style }}>
					{getInitials(displayName, username)}
				</Avatar>
			)}
		</div>
	)
}

export default AvatarPhoto
