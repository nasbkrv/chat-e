import React from 'react'
import './homepage.scss'
import { useSelector } from 'react-redux'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { Box } from '@mui/material'

function Homepage() {
	const {
		data: { chatrooms, }
	} = useSelector((state) => state.user)
	document.title = 'Chatrooms | Chat-E'
	return (
		<Container maxWidth='fluid' style={{ height: 'calc(100% - 56px)' }}>
			<Grid container spacing={2} maxWidth='fluid' style={{ height: '100%' }}>
				<Grid xs={12}>
					<Box className='chatrooms-list'>
						{chatrooms.length === 0 ? (
							<Box textAlign='center'>
								<h2>No chat rooms found.</h2>
								<h2>Open a chat room with a friend now.</h2>
							</Box>
						) : (
							''
						)}
					</Box>
				</Grid>
			</Grid>
		</Container>
	)
}

export default Homepage
