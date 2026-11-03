import React from 'react'


const AuthContext = React.createContext({
    isConnected: false,
    setIsConnected: () => {},
    

})

export default AuthContext