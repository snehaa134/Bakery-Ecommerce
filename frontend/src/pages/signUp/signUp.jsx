import { useFormik } from "formik";
import * as Yup from "yup";
import { useGoogleLoginMutation, useSignUpMutation } from "../../servicesApis/authServices/authServices";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../../firebase/firebase";
import { signInWithPopup } from "firebase/auth";
import "../signUp/signUp.css";

const SignUp = () => {
    const [signUp, { isLoading }] = useSignUpMutation();
    const [googleLogin] = useGoogleLoginMutation();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
        validationSchema: Yup.object({
            name: Yup.string().required("name is required").matches(/^[A-Za-z ]+$/, "name must contain characters only"),
            email: Yup.string().required("email is required").email("invalid email"),
            password: Yup.string().required("password is required").min(8, "password must contain atleast 8 characters"),
            confirmPassword: Yup.string().required("confirm password is required").oneOf([Yup.ref("password")], "passwords must match")
        }),
        onSubmit: async (values) => {
            try {
                const response = await signUp(values).unwrap();
                console.log("response", response);
                formik.resetForm();
                toast.success(response.message);
                navigate("/verify-otp", {
                    state: {
                        email: values.email
                    }
                })


            } catch (error) {
                console.log(error)
                toast.error(error?.data?.message || "signUp failed")

            }
        }

    })

    const handleGoogleLogin = async () => {
        try {
            // const googleProvider = new GoogleAuthProvider();
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
            toast.success("User login successfully")
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
                    <h2>User  SignUp</h2>
                    <div className="form_group">
                        <label>Name:</label>
                        <input type="text" placeholder="Enter Your Name" name="name" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                        {formik.touched.name && formik.errors.name && (<p>{formik.errors.name}</p>)}
                    </div>

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

                    <div className="form_group">
                        <label>Confirm Password:</label>
                        <input type="password" placeholder="Enter Your Password" name="confirmPassword" value={formik.values.confirmPassword} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                        {formik.touched.confirmPassword && formik.errors.confirmPassword && (<p>{formik.errors.confirmPassword}</p>)}
                    </div>



                    <button type="submit" className="submit-button" disabled={isLoading}>{isLoading ? "Signing up..." : "SignUp"}</button>

                    <button type="button" className="google-button" onClick={handleGoogleLogin}>
                        Continue with Google
                    </button>
                    <p>Already have an account
                        <Link to="/login">Login</Link>
                    </p>


                </form>

            </div>

        </>
    )
}
export default SignUp;