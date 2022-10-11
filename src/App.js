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
	// const [users, setUsers] = useState()
	// const usersRef = collection(db, 'users')
	// useEffect(() => {
	// 	const unsubscribe = onSnapshot(usersRef, (snapshot) => {
	// 		setUsers(snapshot.docs.map((user) => user.data()))
	// 	})
	// 	return () => {
	// 		unsubscribe()
	// 	}
	// }, [])
	useEffect(() => {
		try {
			const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
				dispatch(setLoading(true))
				if (currentUser) {
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
						dispatch(
							setUserData({
								uid,
								email,
								emailVerified,
								displayName,
								accessToken,
								phoneNumber,
								photoURL,
								...user
							})
						)
					}
					dispatch(setLoading(false))
				} else {
					localStorage.removeItem('at')
				}
			})
			return unsubscribe
		} catch (error) {
			console.log(error)
		}
	}, [auth, dispatch])
	return (
		<>
			<ThemeProvider theme={darkTheme}>
				<CssBaseline />
				<Routes>
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
				</Routes>
			</ThemeProvider>
		</>
	)
}
const mapStateToProps = (state) => {
	return state
}
export default connect(mapStateToProps)(App)
