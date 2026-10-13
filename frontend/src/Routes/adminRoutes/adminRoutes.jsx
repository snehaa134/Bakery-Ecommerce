import { useContext } from "react";
import { AuthContext } from "../../authContext/authContext";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
    const { authInitialized, isLoggedIn, user } = useContext(AuthContext);
    

    if (!authInitialized) {
        return <p>checking authentication...</p>;
    }

    if (!isLoggedIn) {
        return <Navigate to="/admin-Login" replace />;
    }

    if (user?.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default AdminRoute;