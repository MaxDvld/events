import { jwtDecode } from "jwt-decode";


const ProfilePage = () => {
    // VARIABLES
    const token = window.localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    console.log(decodedToken);


    // TRAITEMENTS

    // RENDU
    return <>
        <h1>Mon profil</h1>
        {decodedToken && (
            <div>
                <p>ID : {decodedToken.user.us_id}</p>
            </div>
        )}
    </>;
}

export default ProfilePage;