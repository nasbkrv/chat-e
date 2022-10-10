import React from 'react'
import CircularProgress from '@mui/material/CircularProgress'

function Loader() {
	return (
		<div style={{
      height:'100%',
      width:'100%',
      display:'flex',
      alignItems:'center',
      justifyContent:'center'
    }}>
			<CircularProgress style={{ color: '#ffca28' }} />
		</div>
	)
}

export default Loader
