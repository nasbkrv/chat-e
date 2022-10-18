import './App.scss'
// import { collection, getDocs, onSnapshot } from 'firebase/firestore'
// import db from './firebase/firebase'
import Drawer from './components/Drawer/Drawer'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { useEffect } from 'react'
import { Routes, Route } from 'react-router'
import Homepage from './pages/home/homepage'
import Login from './pages/login/login'
import { connect } from 'react-redux'
import './scss/global.scss'
import Register from './pages/register/register'
import Profile from './pages/profile/profile'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { setUserData } from './redux/features/user/userSlice'
import PrivateRoute from './services/PrivateRoute'
import PublicRoute from './services/PublicRoute'
import { getStorageToken, getUserById } from './services/services'
import { setLoading } from './redux/features/loader/loaderSlice'
import { useJwt } from 'react-jwt'
import Chatroom from './pages/chat/chatroom'
import { doc, updateDoc } from 'firebase/firestore'
import db from './firebase/firebase'

const darkTheme = createTheme({
	palette: {
		mode: 'dark'
	},
	typography: {
		fontFamily: ['Roboto Condensed']
	}
})
function App({ dispatch }) {
	const auth = getAuth()
	const authToken = getStorageToken('at')
	const { isExpired } = useJwt(authToken)

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
			if (currentUser) {
				dispatch(setLoading(true))
				localStorage.setItem('at', currentUser.accessToken)
				const {
					uid,
					email,
					emailVerified,
					displayName,
					accessToken,
					phoneNumber,
					photoURL
				} = currentUser
				const user = await getUserById(uid)
				if (user) {
					const userRef = doc(db, 'users', uid)
					const date = Date.now()
					await updateDoc(userRef, {
						lastLoginAt: date
					}).then(() => {
						dispatch(
							setUserData({
								uid,
								email,
								emailVerified,
								displayName,
								accessToken,
								phoneNumber,
								photoURL,
								...user,
								lastLoginAt: date
							})
						)
					})
				}
				dispatch(setLoading(false))
			}
		})
		return () => {
			unsubscribe()
		}
	}, [auth, dispatch])
	return (
		<ThemeProvider theme={darkTheme}>
			<CssBaseline />
			<Routes>
				<Route
					path='/sign-in'
					element={
						<PublicRoute isExpired={isExpired}>
							<Login />
						</PublicRoute>
					}
				/>
				<Route
					path='/sign-up'
					element={
						<PublicRoute isExpired={isExpired}>
							<Register />
						</PublicRoute>
					}
				/>
				<Route
					path='/'
					element={
						<PrivateRoute isExpired={isExpired}>
							<Drawer>
								<Homepage />
							</Drawer>
						</PrivateRoute>
					}
				/>
				<Route
					path='/profile'
					element={
						<PrivateRoute isExpired={isExpired}>
							<Drawer>
								<Profile />
							</Drawer>
						</PrivateRoute>
					}
				/>
				<Route
					path='/user/:username'
					element={
						<PrivateRoute isExpired={isExpired}>
							<Drawer>
								<Profile />
							</Drawer>
						</PrivateRoute>
					}
				/>
				<Route
					path='/chat/:username'
					element={
						<PrivateRoute isExpired={isExpired}>
							<Drawer>
								<Chatroom />
							</Drawer>
						</PrivateRoute>
					}
				/>
			</Routes>
		</ThemeProvider>
	)
}
const mapStateToProps = (state) => {
	return state
}
export default connect(mapStateToProps)(App)
