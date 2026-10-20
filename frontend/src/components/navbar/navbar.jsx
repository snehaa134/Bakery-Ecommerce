import { FaSearch } from "react-icons/fa";
import { FaCartPlus } from "react-icons/fa";
import logo from "../../assets/logo/logo.png";
import { Link, useNavigate } from "react-router-dom";
import "../navbar/navbar.css"
import { useContext, useState } from "react";
import { AuthContext } from "../../authContext/authContext";
const Navbar = () => {

    const { isLoggedIn } = useContext(AuthContext);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();

        if (search.trim()) {
            navigate(`/products?search=${encodeURIComponent(search.trim())}`);
        }
    }

    return (
        <>
            <div className="main_navbar">
                <div className="left">
                    <div className="image">
                        <img src={logo} alt="logo" />
                        <h2>BAKERY BLISS</h2>
                    </div>
                </div>

                <div className="center">
                    <Link to="/">Home</Link>
                    <Link to="/products">Shop</Link>
                    <Link to="/about-us">AboutUs</Link>
                </div>


                <div className="right">
                    

                    <form className="search" onSubmit={handleSearch}>
                        <input type="text" placeholder="search Products" value={search} onChange={(e) => setSearch(e.target.value)} />
                        <button type="submit">
                            <FaSearch />
                        </button>
                    </form>



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
                        <button onClick={() => navigate("/login")}>
                            Login
                        </button>
                    )}

                </div>

            </div>

        </>
    )
}
export default Navbar;