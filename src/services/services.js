import {
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	where
} from 'firebase/firestore'
import db from '../firebase/firebase'

// Get local storage token by token name
export function getStorageToken(token) {
	return localStorage.getItem(token)
}
// Get user doc by user ID
export async function getUserById(id) {
	const docSnap = await getDoc(doc(db, 'users', id))
	if (docSnap.exists()) {
		return docSnap.data()
	} else {
		throw new Error('No user found by this ID!')
	}
}
// Get all users collection
export async function getAllUsers() {
	const querySnapshot = await getDocs(collection(db, 'users'))
	const users = []
	querySnapshot.forEach((doc) => {
		users.push({ ...doc.data(), uid: doc.id })
	})
	return users
}
// Check if user exist by username
export async function userExists(username) {
	const q = query(collection(db, 'users'), where('username', '==', username))
	const querySnapshot = await getDocs(q)
	return !querySnapshot.empty
}
// Get user's initials from username
export function getInitials(displayName) {
	if (!displayName) {
		return 'JD'
	}
	const nameSplit = displayName.split(' ')
	const firstName = nameSplit[0][0]
	const lastName = nameSplit[nameSplit.length - 1][0]
	return `${firstName}${lastName}`
}
