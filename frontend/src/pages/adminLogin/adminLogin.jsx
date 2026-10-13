import { useFormik } from "formik";
import * as Yup from "yup";
import { useGoogleLoginMutation } from "../../servicesApis/authServices/authServices";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../authContext/authContext";
import { toast } from "react-toastify";
import { auth, googleProvider } from "../../firebase/firebase";
import { signInWithPopup } from "firebase/auth";
import "../adminLogin/adminLogin.css";
import { useAdminLoginMutation } from "../../servicesApis/adminAuthServices/adminAuthServices";

const AdminLogin = () => {
    const [adminLogin, { isLoading }] = useAdminLoginMutation();
    const { setIsLoggedIn, setUser } = useContext(AuthContext);
    const [googleLogin] = useGoogleLoginMutation();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        validationSchema: Yup.object({
            email: Yup.string().required("email is required").email("invalid email"),
            password: Yup.string().required("password is required")
        }),
        onSubmit: async (values) => {
            try {
                const response = await adminLogin(values).unwrap();
                console.log("response", response);
                setUser(response?.data);
                setIsLoggedIn(true);
                formik.resetForm();
                toast.success(response.message);
                navigate("/manage-categories");


            } catch (error) {
                console.log("Login-error", error)
                toast.error(error?.data?.message || "admin Login failed")

            }
        }

    })
    const handleGoogleLogin = async () => {
        try {
            googleProvider.setCustomParameters({
                prompt: "select_account"
            })
            const result = await signInWithPopup(auth, googleProvider);
            const user = await result.user;
            console.log("user", user);
            const idToken = await user.getIdToken();
            console.log("idtoken", idToken);
            const response = await googleLogin({
                idToken
            })
            console.log("response", response);
            setIsLoggedIn(true)
            toast.success(response.message)
            navigate("/")


        } catch (error) {
            console.log("error", error);
            toast.error(error?.data?.message || "Something went wrong")
        }
    }


    return (
        <>
            <div className="main-page">

                <form onSubmit={formik.handleSubmit}>
                    <h2>Admin Login</h2>


                    <div className="form_group">
                        <label>Email:</label>
                        <input type="email" placeholder="Enter Your Email" name="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                        {formik.touched.email && formik.errors.email && (<p>{formik.errors.email}</p>)}
                    </div>

                    <div className="form_group">
                        <label>Password:</label>
                        <input type="password" placeholder="Enter Your Password" name="password" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                        {formik.touched.password && formik.errors.password && (<p>{formik.errors.password}</p>)}
                    </div>


                    <button type="submit" className="submit-button" disabled={isLoading}>
                        {isLoading ? "logging-in" : "login"}
                    </button>

                    <button type="button" className="google-button" onClick={handleGoogleLogin}>
                        Continue with Google
                    </button>


                    <p>Don't have an account?
                        <Link to="/admin-SignUp">Sign Up</Link>
                    </p>

                </form>
            </div>

        </>
    )
}
export default AdminLogin;