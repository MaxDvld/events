import React from 'react'


const AuthContext = React.createContext({
    isConnected: false,
    setIsConnected: () => {},
    user: null,
    setUser: () => {},

})

export default AuthContext