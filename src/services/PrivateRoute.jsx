import React from 'react'
import { Navigate } from 'react-router'
function PrivateRoute({ isExpired , children}) {
	if (isExpired) {
		return <Navigate to='/sign-in' />
	}
	return children
}

export default PrivateRoute
