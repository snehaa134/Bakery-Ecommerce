import { useContext } from "react";
import { useLogoutMutation } from "../../servicesApis/authServices/authServices";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../authContext/authContext";

const Profile = () => {
    const [logout] = useLogoutMutation();
    const{setIsLoggedIn}=useContext(AuthContext);
    const navigate=useNavigate();

    const handleLogout= async()=>{
        const response= await logout();
        setIsLoggedIn(false);
        navigate("/")

    }
    return (
        <>
            <button onClick={handleLogout}>
                logout
            </button>
        </>
    )
}
export default Profile;