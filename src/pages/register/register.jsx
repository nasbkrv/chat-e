import React, { useState } from 'react'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import { Button, TextField, Typography } from '@mui/material'
import { Link, Navigate } from 'react-router-dom'
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import db from '../../firebase/firebase'
import Loader from '../../components/Loader/Loader'
const inputStyles = {
	marginBottom: 2,
	'.MuiInput-underline:after': {
		borderColor: '#ffca28'
	},
	'& label.Mui-focused': {
		color: '#ffca28'
	}
}
function Register({ loading }) {
	const auth = getAuth()
	const [invalidForm, setInvalidForm] = useState({
		email: false,
		password: false,
		rePasword: false,
		msg: ''
	})
	const [failedReg, setFailedReg] = useState()
	if (auth.currentUser) {
		return <Navigate to='/' />
	}
	function validateRegister(email, password, rePassword) {
		const emailPattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
		if (!emailPattern.test(email)) {
			return {
				invalid: true,
				msg: 'Invalid email address',
				code: 'invalid-email'
			}
		}
		if (password.length < 6) {
			return {
				invalid: true,
				msg: 'Passwords too short',
				code: 'pass-short'
			}
		}
		if (rePassword !== password) {
			return {
				invalid: true,
				msg: "Passwords don't match",
				code: 'pass-mismatch'
			}
		}
		return { invalid: false, msg: '', code: null }
	}
	function handleRegister(event) {
		event.preventDefault()
		const formData = new FormData(event.target)
		const { email, password, rePassword } = Object.fromEntries(
			formData.entries()
		)
		const { invalid, msg, code } = validateRegister(email, password, rePassword)
		setFailedReg(null)
		if (invalid) {
			setInvalidForm({
				email: false,
				password: false,
				rePasword: false
			})
			switch (true) {
				case code === 'invalid-email':
					setInvalidForm({
						email: true,
						password: false,
						rePasword: false,
						msg
					})
					break
				case code === 'pass-short':
					setInvalidForm({
						email: false,
						password: true,
						rePasword: false,
						msg
					})
					break
				case code === 'pass-mismatch':
					setInvalidForm({
						email: false,
						password: false,
						rePasword: true,
						msg
					})
					break

				default:
					break
			}
		} else {
			setInvalidForm({
				email: false,
				password: false,
				rePasword: false,
				msg
			})
			createUserWithEmailAndPassword(auth, email, password)
				.then(async (res) => {
					const {
						displayName,
						email,
						emailVerified,
						metadata: { createdAt, lastLoginAt },
						phoneNumber,
						photoURL,
						uid
					} = res.user
					await setDoc(doc(db, 'users', uid), {
						displayName,
						email,
						emailVerified,
						createdAt,
						lastLoginAt,
						phoneNumber,
						photoURL,
						chatrooms: [],
						friends: [],
						username: ''
					})
				})
				.catch((error) => {
					const errorCode = error.code
					switch (true) {
						case errorCode === 'auth/email-already-in-use':
							setFailedReg('Email address already in use')
							break
						default:
							break
					}
					console.error(error)
				})
		}
	}

	return (
		<>
			{loading ? (
				<Loader />
			) : (
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
									<Box component='span'>SIGN UP TO </Box>
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
									noValidate
									onSubmit={handleRegister}
									autoComplete='off'
									flexDirection='column'
									display={'flex'}
									className='login-form'
									paddingTop='40px'>
									<TextField
										id='sign-up-email'
										name='email'
										label='Email address'
										type='email'
										variant='standard'
										helperText={invalidForm.email ? invalidForm.msg : ''}
										error={invalidForm.email}
										sx={inputStyles}
										className='input-field'
									/>
									<TextField
										id='sign-up-password'
										name='password'
										label='Password'
										type='password'
										variant='standard'
										className='input-field'
										helperText={invalidForm.password ? invalidForm.msg : ''}
										error={invalidForm.password}
										sx={inputStyles}
									/>
									<TextField
										id='sign-up-repassword'
										name='rePassword'
										type='password'
										label='Repeat Password'
										variant='standard'
										className='input-field'
										helperText={invalidForm.rePasword ? invalidForm.msg : ''}
										error={invalidForm.rePasword}
										sx={inputStyles}
									/>
									{failedReg && (
										<p style={{ marginTop: 0, color: '#f44336' }}>
											{failedReg}
										</p>
									)}
									<small>
										Already have an account?
										<Link
											to='/sign-in'
											style={{
												color: '#ffca28',
												marginLeft: '5px'
											}}>
											Sign in here!
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
										Sign up
									</Button>
								</Box>
							</Box>
						</Grid>
					</Grid>
				</Container>
			)}
		</>
	)
}

export default Register
