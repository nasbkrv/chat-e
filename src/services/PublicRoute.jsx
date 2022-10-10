import React from 'react'
import { Navigate } from 'react-router'

function PublicRoute({ isExpired, children }) {
	// User not logged in
	if (isExpired) {
		return children
	}
	return <Navigate to='/' />
}

export default PublicRoute
