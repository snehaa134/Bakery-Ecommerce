
import { FaSearch, FaCartPlus } from "react-icons/fa";
import logo from "../../assets/logo/logo.png";
import { Link, useNavigate } from "react-router-dom";
import "../navbar/navbar.css";
import { useContext, useState } from "react";
import { AuthContext } from "../../authContext/authContext";
import { useGetCartQuery } from "../../servicesApis/cartServices/cartServices";

const Navbar = () => {
    const { user, isLoggedIn } = useContext(AuthContext);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const {data}=useGetCartQuery();
    const items = data?.data?.items || [];
    const cartCount=items?.length;

    const handleSearch = (e) => {
        e.preventDefault();

        if (search.trim()) {
            navigate(
                `/products?search=${encodeURIComponent(search.trim())}`
            );
        }
    };

    return (
        <div className="main_navbar">
            <div className="left">
                <div className="image">
                    <img src={logo} alt="logo" />
                    <h2>BAKERY BLISS</h2>
                </div>
            </div>

            {user?.role === "admin" ? (
                <>
                    <div className="center">
                        <Link to="/manage-categories">
                            Manage-Categories
                        </Link>

                        <Link to="/manage-banners">
                            Manage-Banners
                        </Link>

                        <Link to="/manage-products">
                            Manage-Products
                        </Link>

                        <Link to="/manage-orders">
                            Manage-Orders
                        </Link>
                    </div>

                    <div className="right">
                     <Link to = "/Profile">Admin Profile</Link>
                    </div>
                </>
            ) : (
                <>
                    <div className="center">
                        <Link to="/">Home</Link>
                        <Link to="/products">Shop</Link>
                        <Link to="/about-us">About Us</Link>
                    </div>

                    <div className="right">
                        <form className="search" onSubmit={handleSearch}>
                            <input
                                type="text"
                                placeholder="Search Products"
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                            />

                            <button type="submit">
                                <FaSearch />
                            </button>
                        </form>

                        <Link to="/cart" className="cart-icon">
                            <FaCartPlus />
                    {cartCount > 0 &&(
                        <span className="cart-count">{cartCount}</span>
                    )}
                        </Link>

                        {isLoggedIn ? (
                            <Link to="/profile">Profile</Link>
                        ) : (
                            <button onClick={() => navigate("/login")}>
                                Login
                            </button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default Navbar;
