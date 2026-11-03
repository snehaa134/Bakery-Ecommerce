
import { FaSearch, FaCartPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "../navbar/navbar.css";
import { useContext, useState } from "react";
import { GiCupcake } from "react-icons/gi";
import { AuthContext } from "../../authContext/authContext";
import { useGetCartQuery } from "../../servicesApis/cartServices/cartServices";
import FestiveDecorations from "../festiveDecoration/festiveDecoration";

const Navbar = () => {
    const { user, isLoggedIn } = useContext(AuthContext);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const { data } = useGetCartQuery();

    const items = data?.data?.items || [];

    const cartCount = items.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const handleSearch = (e) => {
        e.preventDefault();

        if (search.trim()) {
            navigate(`/products?search=${encodeURIComponent(search.trim())}`);
        }
    };

    if (user?.role === "admin") {
        return (
            <aside className="admin-sidebar">
                <Link to="/admin-dashboard" className="admin-logo">
                    <GiCupcake />
                    <span>Bakery Bliss</span>
                </Link>

                <div className="admin-sidebar-heading">
                    ADMIN PANEL
                </div>

                <nav className="admin-sidebar-links">
                    <Link to="/manage-categories">Categories</Link>
                    <Link to="/manage-banners">Banners</Link>
                    <Link to="/manage-products">Products</Link>
                    <Link to="/manage-orders">Orders</Link>
                    <Link to="/add-festive-theme">Add Theme</Link>
                    <Link to="/manage-festive-themes">Manage Themes</Link>
                    <Link to="/admin-profile">Admin Profile</Link>
                </nav>
            </aside>
        );
    }

    return (
        <div className="navbar-wrapper">

            <FestiveDecorations />

            <div className="main_navbar">

                <div className="left">
                    <div className="image">
                        <Link to="/" className="navbar-logo">
                            <h2>
                                <GiCupcake />
                                Bakery Bliss
                            </h2>
                        </Link>
                    </div>
                </div>

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
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <button type="submit">
                            <FaSearch />
                        </button>
                    </form>

                    <Link to="/cart" className="cart-icon">
                        <FaCartPlus />
                        {cartCount > 0 && (
                            <span className="cart-count">
                                {cartCount}
                            </span>
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

            </div>
        </div>
    );
};

export default Navbar;
