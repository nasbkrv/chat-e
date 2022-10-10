import React from 'react'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import { Button, TextField, Typography } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { connect } from 'react-redux'
const inputStyles = {
	marginBottom: 2,
	'.MuiInput-underline:after': {
		borderColor: '#ffca28'
	},
	'& label.Mui-focused': {
		color: '#ffca28'
	}
}
function Login({ isExpired }) {
	const auth = getAuth()
	const navigate = useNavigate()
	function handleFormSubmit(event) {
		event.preventDefault()
		const formData = new FormData(event.target)
		const { email, password } = Object.fromEntries(formData.entries())
		signInWithEmailAndPassword(auth, email, password).then(({ user }) => {
			const { accessToken } = user
			localStorage.setItem('at', accessToken)
			if (user) navigate('/')
		})
	}

	return (
		<Container maxWidth='lg'>
			<Grid
				container
				spacing={2}
				sx={{
					flexDirection: { xs: 'column-reverse', md: 'row' },
					paddingTop: '150px'
				}}>
				<Grid xs={12} md={6}>
					<Box
						width='100%'
						height={500}
						bgcolor={'#21242e'}
						borderRadius={2}
						padding={'35px 40px'}>
						<Box
							component='span'
							color={'#ffca28'}
							fontSize={60}
							className='logo-font'>
							Chat-E
						</Box>
						<Typography
							variant='h6'
							paddingBottom={4}
							color='#ffc107'
							padding={'10px 0'}>
							Free chat platform
						</Typography>
						<Typography paragraph>
							Chat with your friends around the world.
						</Typography>
					</Box>
				</Grid>
				<Grid xs={12} md={6}>
					<Box
						width='100%'
						height={500}
						bgcolor={'#21242e'}
						borderRadius={2}
						padding={'55px 70px'}>
						<Typography variant='h5'>
							<Box component='span'>SIGN IN TO </Box>
							<Box
								component='span'
								color={'#ffca28'}
								fontSize={28}
								className='logo-font'>
								Chat-E
							</Box>
						</Typography>
						<Box
							component='form'
							onSubmit={handleFormSubmit}
							noValidate
							autoComplete='off'
							flexDirection='column'
							display={'flex'}
							id='login-form'
							paddingTop='40px'>
							<TextField
								id='sign-in-email'
								name='email'
								label='Email address'
								variant='standard'
								type='email'
								// helperText='Invalid email'
								sx={inputStyles}
								className='input-field'
							/>
							<TextField
								id='sign-in-password'
								name='password'
								label='Password'
								variant='standard'
								className='input-field'
								type='password'
								// helperText='Invalid password'
								sx={inputStyles}
							/>
							<small>
								Don't have an account?{' '}
								<Link
									to='/sign-up'
									style={{
										color: '#ffca28',
										marginLeft: '5px'
									}}>
									Sign up here!
								</Link>
							</small>
							<Button
								variant='contained'
								type='submit'
								sx={{
									backgroundColor: '#ffca28',
									color: '#21242e',
									fontWeight: 600,
									fontSize: 18,
									marginTop: 2,
									':hover': {
										backgroundColor: '#daa300'
									}
								}}>
								Sign in
							</Button>
						</Box>
					</Box>
				</Grid>
			</Grid>
		</Container>
	)
}
const mapStateToProps = (state) => {
	return state
}
export default connect(mapStateToProps)(Login)
