import { Avatar } from '@mui/material'
import React from 'react'
import { getInitials } from '../../services/services'

function AvatarPhoto({ photoURL, displayName,style }) {
	return (
		<>
			{photoURL ? (
				<Avatar alt={getInitials(displayName)} src={photoURL} style={style} />
			) : (
				<Avatar
					alt='Remy Sharp'
					sx={{ bgcolor: '#ffca28', color: '#21242e' }}
					style={style}>
					{getInitials(displayName)}
				</Avatar>
			)}
		</>
	)
}

export default AvatarPhoto
