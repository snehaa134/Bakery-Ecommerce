
import { useContext } from "react";
import { AuthContext } from "../../authContext/authContext";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const { isLoggedIn, authInitialized } = useContext(AuthContext);

    if (!authInitialized) {
        return <p>Loading...</p>;
    }

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
