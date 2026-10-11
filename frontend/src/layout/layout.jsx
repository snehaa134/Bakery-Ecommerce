import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/navbar";
import Footer from "../components/footer/footer";
import "../layout/layout.css";

const Layout = () => {
    return (
        <>
            <div className="layout">
                <Navbar />
                <div className="main">
                    <Outlet />
                </div>
                <Footer />
            </div>
        </>
    )
}
export default Layout;