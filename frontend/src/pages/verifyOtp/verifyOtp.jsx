import { useFormik } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useResendOtpMutation, useVerifyOtpMutation } from "../../servicesApis/authServices/authServices";
import { toast } from "react-toastify";
import { useContext } from "react";
import { AuthContext } from "../../authContext/authContext";
import "../verifyOtp/verifyOtp.css";
const VerifyOtp = () => {
    const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
    const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();
    const location = useLocation();
    const navigate = useNavigate();
    const { setIsLoggedIn, setUser } = useContext(AuthContext);
    const email = location.state?.email;

    const formik = useFormik({

        initialValues: {
            email: email,
            otp: ""
        },
        validationSchema: Yup.object({
            otp: Yup.string().required("OTP is required").length(4, "OTP must be 4 digits")
        }),
        onSubmit: async (values) => {
            try {
                const response = await verifyOtp(values).unwrap();
                console.log("response", response);
                setUser(response.data);
                setIsLoggedIn(true);
                formik.resetForm();
                toast.success(response.message);
                navigate("/")

            } catch (error) {
                console.log("error", error);
                toast.error(error?.data?.message || "OTP verification failed")
            }
        }
    })

    const handleResend = async () => {
        if (!email) {
            toast.error("Email not found,Please signUp again");
            return;
        }
        try {
            const response = await resendOtp(email).unwrap();
            console.log("response", response);
            toast.success(response.message);

        } catch (error) {
            console.log(error);
            toast.error(error?.data?.message || "Failed to resend OTP")
        }
    }


    return (
        <>
            <div className="main-otp">
                <h2>Verify-OTP</h2>
                <form onSubmit={formik.handleSubmit}>
                    <div className="form-group">
                        <input type="text" name="otp" placeholder="Enter OTP here" value={formik.values.otp} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                        {formik.touched.otp && formik.errors.otp && (<p>{formik.errors.otp}</p>)}
                    </div>

                    <button type="submit" disabled={isLoading}>
                        {isLoading ? "verifying-otp" : "verifyOtp"}
                    </button>
                    <p>Don't Receive the OTP?</p>

                    <button type="button" disabled={isResending || !email} onClick={handleResend} className="resendBtn">
                        {isResending ? "sending.." : "Resend-otp"}
                    </button>
                </form>

            </div>
        </>
    )
}
export default VerifyOtp;