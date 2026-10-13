import { useContext } from "react";
import { useLogoutMutation } from "../../servicesApis/authServices/authServices";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../authContext/authContext";

const Profile = () => {
    const [logout] = useLogoutMutation();
    const{setIsLoggedIn,setUser}=useContext(AuthContext);
    const navigate=useNavigate();

    const handleLogout= async()=>{
        try {
            const response= await logout().unwrap();
        setIsLoggedIn(false);
        setUser(null);
        navigate("/")
        } catch (error) {
            console.log("error",error)
        }
        

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