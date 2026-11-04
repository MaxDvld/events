import { useContext } from "react";
import AuthContext from "../Context/AuthContext";
import LoginPage from "../Pages/LoginPage";

const AuthWrapper = ({ children }) => {
    const { isConnected } = useContext(AuthContext); 
    return<>
    {isConnected ? children : <LoginPage />}
    </>
}

export default AuthWrapper