import {
	arrayUnion,
	collection,
	doc,
	documentId,
	getDoc,
	getDocs,
	query,
	setDoc,
	updateDoc,
	where
} from 'firebase/firestore'
import CryptoJS from 'crypto-js'
import db from '../firebase/firebase'

// Get local storage token by token name
export function getStorageToken(token) {
	return localStorage.getItem(token)
}
// Get user doc by user ID
export async function getUserById(id) {
	const docSnap = await getDoc(doc(db, 'users', id))
	if (docSnap.exists()) {
		return { ...docSnap.data(), uid: id }
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
export async function getUserByUsername(username) {
	const q = query(collection(db, 'users'), where('username', '==', username))
	const querySnapshot = await getDocs(q)
	return querySnapshot.empty
		? false
		: querySnapshot.docs.map((doc) => doc.data())
}
// Get user's initials from username
export function getInitials(displayName, username) {
	if (displayName) {
		const nameSplit = displayName.split(' ')
		const firstName = nameSplit[0][0]
		const lastName = nameSplit[nameSplit.length - 1][0]
		return `${firstName}${lastName}`
	} else {
		// get first letter from username
		return username[0].toUpperCase()
	}
}
//Function to check if users are friends
export function checkIfFriends(user1, user2) {
	return user1.friends.includes(user2.uid)
}
// Function to open chatroom
export async function openChatroom(currentUser, user) {
	const chatroomName = [currentUser.username, user.username].sort().join('&')
	const chatroomRef = collection(db, 'chatrooms')
	const q = query(chatroomRef, where(documentId(), '==', chatroomName))
	const res = await getDocs(q)
	if (res.empty) {
		const firstUserRef = doc(db, 'users', currentUser.uid)
		const secondUserRef = doc(db, 'users', user.uid)

		await updateDoc(firstUserRef, {
			chatrooms: arrayUnion(chatroomName)
		})
		await updateDoc(secondUserRef, {
			chatrooms: arrayUnion(chatroomName)
		})
		await setDoc(doc(chatroomRef, chatroomName), {
			photo: '',
			messages: []
		})
		return {
			user,
			photo: '',
			messages: []
		}
	} else {
		const [chatroom] = res.docs.map((doc) => doc.data())
		return { ...chatroom, user }
	}
}
// Encrypt message
export function encryptMessage(message) {
	const encryptedMessage = CryptoJS.AES.encrypt(
		message,
		process.env.REACT_APP_ENCRYPT_KEY
	).toString()
	return encryptedMessage
}
// Decrypt message
export function decryptMessage(message) {
	const decryptedMessage = CryptoJS.AES.decrypt(
		message,
		process.env.REACT_APP_ENCRYPT_KEY
	).toString(CryptoJS.enc.Utf8)
	return decryptedMessage
}
