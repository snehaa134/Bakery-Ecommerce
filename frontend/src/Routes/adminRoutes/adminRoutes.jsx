import { useContext } from "react";
import { AuthContext } from "../../authContext/authContext";

const AdminRoute = () => {
    const { isLoggedIn, user } = useContext(AuthContext);
    if (!isLoggedIn) {
        return < Navigate to="/admin-Login" replace />
    }
    if (user?.role !== "admin") {
        return <Navigate to="/" replace />
    }
}
export default AdminRoute;