import { Route, Routes } from "react-router-dom";
import Layout from "./layout/layout";
import Home from "./pages/Home/home";
import SignUp from "./pages/signUp/signUp";
import Login from "./pages/login/login";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import Profile from "./pages/profile/profile";
import VerifyOtp from "./pages/verifyOtp/verifyOtp";
import AdminSignUp from "./pages/adminSignup/adminSignup";
import AdminLogin from "./pages/adminLogin/adminLogin";
import ProtectedRoute from "./Routes/protectedRoutes/protectedRoutes";
import AdminRoute from "./Routes/adminRoutes/adminRoutes";
import AdminDashboard from "./pages/adminDashboard/adminDashboard";
import PublicRoute from "./Routes/publicRoutes/publicRoutes";

const App = () => {
  return (
    <>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="admin-SignUp" element={<AdminSignUp />} />
          <Route path="admin-Login" element={<AdminLogin />} />
          <Route path="verify-otp" element={<VerifyOtp />} />

        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Route>

      </Routes>
      <ToastContainer />

    </>
  )
}
export default App;