import { doc, getDoc } from 'firebase/firestore'
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
