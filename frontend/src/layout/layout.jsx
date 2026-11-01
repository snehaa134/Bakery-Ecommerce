import { Outlet } from "react-router-dom";

import { useContext } from "react";
import Navbar from "../components/navbar/navbar";
import Footer from "../components/footer/footer";
import { AuthContext } from "../authContext/authContext";
import FestiveDecorations from "../components/festiveDecoration/festiveDecoration";

const Layout = () => {
    const { user } = useContext(AuthContext);

    return (
        <>
            {user?.role === "admin" ? (
                <div className="admin-page-layout">
                    <Navbar />

                    <div className="admin-main-content">
                        <Outlet />
                    </div>
                </div>
            ) : (
                <>
                <FestiveDecorations/>
                    <Navbar />
                    <Outlet />
                    <Footer />
                </>
            )}
        </>
    );
};

export default Layout;