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
import AddCategory from "./pages/addCategory/addCategory";
import UpdateCategory from "./pages/updateCategory/updateCategory";
import ManageCategories from "./pages/manageCategories/manageCategories";
import AddBanner from "./pages/addBanner/addBanner";
import UpdateBanner from "./pages/updateBanner/updateBanner";
import ManageBanners from "./pages/manageBanners/manageBanners";
import AddProduct from "./pages/addProduct/addProduct";
import UpdateProduct from "./pages/updateProduct/updateProduct";
import ManageProducts from "./pages/manageProducts/manageProducts";
import Products from "./pages/productPage/product";
import ProductDetails from "./pages/productDetailPage/productDetail";
import Cart from "./pages/cart/cart";
import About from "./pages/aboutUs/about";
import AdminProfile from "./pages/adminProfile/adminProfile";
import ManageOrders from "./pages/manageOrders/manageOrders";
import Checkout from "./pages/checkout/checkout";
import OrderReceipt from "./pages/receipt/receipt";
import MyOrders from "./pages/myOrders/myOrders";
import ManageFestiveThemes from "./pages/manageFestiveTheme/manageThemes";
import EditFestiveTheme from "./pages/updateFestiveTheme/updateFestiveTheme";
import AddFestiveTheme from "./pages/addFestiveTheme/addFestiveTheme";
import { ThemeProvider } from "./festiveThemeContext/festiveThemeContext";

const App = () => {
  return (
    <ThemeProvider>
      <>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<Products />} />
              <Route path="/product-details/:id" element={<ProductDetails />} />
              <Route path="/about-us" element={<About />} />
              <Route path="/cart" element={<Cart />} />
            </Route>

            <Route path="/login" element={<Login />} />
            <Route path="/signUp" element={<SignUp />} />
            <Route path="/admin-SignUp" element={<AdminSignUp />} />
            <Route path="/admin-Login" element={<AdminLogin />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />



          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-receipt/:id" element={<OrderReceipt />} />
            <Route path="/my-orders" element={<MyOrders />} />

          </Route>

          <Route element={<AdminRoute />}>
            <Route element={<Layout />}>
              <Route path="/manage-banners" element={<ManageBanners />} />
              <Route path="/manage-categories" element={<ManageCategories />} />
              <Route path="/manage-products" element={<ManageProducts />} />
              <Route path="/manage-orders" element={<ManageOrders />} />
              <Route path="/manage-festive-themes" element={<ManageFestiveThemes />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/add-category" element={<AddCategory />} />
              <Route path="/update-category/:id" element={<UpdateCategory />} />
              <Route path="/add-banner" element={<AddBanner />} />
              <Route path="/update-banner/:id" element={<UpdateBanner />} />
              <Route path="/add-product" element={<AddProduct />} />
              <Route path="/update-product/:id" element={<UpdateProduct />} />
              <Route path="/add-festive-theme" element={<AddFestiveTheme />} />
              <Route path="/edit-festive-theme/:id" element={<EditFestiveTheme />} />
            </Route>
            <Route path="/admin-profile" element={<AdminProfile/>}/>
          </Route>

        </Routes>
        <ToastContainer />
      </>
    </ThemeProvider>
  )
}
export default App;