import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../authContext/authContext";

const PublicRoute = () => {

  const { user, authInitialized } = useContext(AuthContext);

  if (!authInitialized) {
    return <p>Loading...</p>
  }

  if (user?.role === "admin") {
    return <Navigate to="/manage-categories" replace />
  }
  return <Outlet />
}
export default PublicRoute;