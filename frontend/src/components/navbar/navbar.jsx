import { FaSearch } from "react-icons/fa";
import { FaCartPlus } from "react-icons/fa";
import logo from "../../assets/logo/logo.png";
import { Link, useNavigate } from "react-router-dom";
import "../navbar/navbar.css"
import { useContext } from "react";
import { AuthContext } from "../../authContext/authContext";
const Navbar = () => {

    const { isLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();
    return (
        <>
            <div className="main_navbar">
                <div className="left">
                    <div className="image">
                        <img src={logo} alt="logo" />
                    </div>
                </div>

                <div className="center">
                    <Link to="/">Home</Link>
                    <Link to="/">Shop</Link>
                    <Link to="/">AboutUs</Link>
                </div>


                <div className="right">

                    <div className="search">
                        <input type="text" placeholder="Search Products.." />
                        <FaSearch />
                    </div>


                    <Link to="/cart">
                        <FaCartPlus />
                    </Link>

                    {isLoggedIn ? (
                        <Link to="/profile">
                            Profile
                        </Link>
                    ) : (
                        // <Link to="/login">
                        //     Login
                        // </Link>
                        <button onClick={()=>navigate("/login")}>
                            Login
                        </button>
                    )}

                </div>

            </div>

        </>
    )
}
export default Navbar;