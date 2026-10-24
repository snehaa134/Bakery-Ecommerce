

import { useFormik } from "formik";
import * as Yup from "yup";
import { useGetCartQuery } from "../../servicesApis/cartServices/cartServices";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import formatPrice from "../../utils/formatPrice";
import "../checkout/checkout.css";
import { useCreateOrderMutation } from "../../servicesApis/orderServices/orderServices";

const Checkout = () => {
    const { data, isLoading, isError } = useGetCartQuery();
    const [createOrder, { isLoading: isPlacingOrder }] = useCreateOrderMutation();

    const items = data?.data?.items || [];

    const subTotal = items.reduce((total, item) => {
        return total + item.product.sellingPrice * item.quantity
    }, 0);

    const cgst = subTotal * 2.5 / 100;
    const sgst = subTotal * 2.5 / 100;
    const totalGst = cgst + sgst;
    const totalAmount = subTotal + totalGst;

    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            fullName: "",
            email: "",
            phone: "",
            address: "",
            city: "",
            state: "",
            postalCode: ""
        },

        validationSchema: Yup.object({
            fullName: Yup.string()
                .trim()
                .required("Full name is required"),

            email: Yup.string()
                .email("Please Enter a Valid Email address")
                .required("Email is required"),

            phone: Yup.string()
                .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit Phone number")
                .required("Phone number is required"),

            address: Yup.string()
                .trim()
                .required("Address is required"),

            city: Yup.string()
                .trim()
                .required("City is required"),

            state: Yup.string()
                .trim()
                .required("State is required"),

            postalCode: Yup.string()
                .matches(/^\d{6}$/, "Enter a valid 6-digit PIN code")
                .required("PIN code is required")
        }),

        onSubmit: async (values) => {
            if (items.length === 0) {
                toast.error("Your Cart is Empty");
                navigate("/cart");
                return;
            }

            try {
                const response = await createOrder({
                    ...values,
                    paymentMethod: "COD"
                }).unwrap();

                toast.success(response?.message || "Order placed successfully!");

                navigate("/my-orders");
            } catch (error) {
                toast.error(
                    error?.data?.message || "Failed to place order. Please try again."
                );
            }
        }
    });

    if (isLoading) {
        return <p>Loading checkout...</p>;
    }

    if (isError) {
        return <p>Failed to get cart items</p>;
    }

    if (items.length === 0) {
        return (
            <div className="empty-checkout">
                <h2>Your Cart is Empty</h2>
                <button onClick={() => navigate("/products")}>
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <>
            <div className="main-checkout">
                <h2>Checkout</h2>

                <form onSubmit={formik.handleSubmit}>
                    <div className="left-side">

                        <div className="form-group">
                            <label>Full Name:</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formik.values.fullName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.fullName && formik.errors.fullName && (
                                <p>{formik.errors.fullName}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.email && formik.errors.email && (
                                <p>{formik.errors.email}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Phone no:</label>
                            <input
                                type="tel"
                                name="phone"
                                maxLength={10}
                                value={formik.values.phone}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.phone && formik.errors.phone && (
                                <p>{formik.errors.phone}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Address:</label>
                            <input
                                type="text"
                                name="address"
                                value={formik.values.address}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.address && formik.errors.address && (
                                <p>{formik.errors.address}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label>City:</label>
                            <input
                                type="text"
                                name="city"
                                value={formik.values.city}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.city && formik.errors.city && (
                                <p>{formik.errors.city}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label>State:</label>
                            <input
                                type="text"
                                name="state"
                                value={formik.values.state}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.state && formik.errors.state && (
                                <p>{formik.errors.state}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label>PIN Code:</label>
                            <input
                                type="text"
                                name="postalCode"
                                maxLength={6}
                                value={formik.values.postalCode}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.postalCode && formik.errors.postalCode && (
                                <p>{formik.errors.postalCode}</p>
                            )}
                        </div>

                        <div className="payment-option">
                            <input
                                type="radio"
                                name="paymentMethod"
                                checked
                                readOnly
                            />
                            <label>
                                <strong>Cash on delivery (COD)</strong>
                                <span>Pay when your order arrives</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="place-order-btn"
                            disabled={formik.isSubmitting || isPlacingOrder}
                        >
                            {isPlacingOrder ? "Placing Order..." : "Place Order"}
                        </button>

                    </div>
                </form>

                <div className="right-side">
                    <div className="order-summary">
                        <h3>Your Order</h3>

                        <div className="checkout-products">
                            {items.map((item) => (
                                <div
                                    className="checkout-items"
                                    key={item.product._id}
                                >
                                    <div className="checkout-product-info">
                                        <h4>{item.product.productName}</h4>
                                        <p>Qty: {item.quantity}</p>
                                    </div>

                                    <strong>
                                        {formatPrice(
                                            item.product.sellingPrice * item.quantity
                                        )}
                                    </strong>
                                </div>
                            ))}
                        </div>

                        <div className="summary-breakdown">
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>{formatPrice(subTotal)}</span>
                            </div>

                            <div className="summary-row">
                                <span>CGST (2.5%)</span>
                                <span>{formatPrice(cgst)}</span>
                            </div>

                            <div className="summary-row">
                                <span>SGST (2.5%)</span>
                                <span>{formatPrice(sgst)}</span>
                            </div>

                            <div className="summary-row">
                                <span>Total GST:</span>
                                <span>{formatPrice(totalGst)}</span>
                            </div>
                        </div>

                        <div className="summary-total">
                            <span>Total Amount</span>
                            <strong>{formatPrice(totalAmount)}</strong>
                        </div>

                        <p className="message">
                            Pay the total amount in cash upon delivery.
                        </p>

                        <button
                            type="button"
                            className="back-btn"
                            onClick={() => navigate("/cart")}
                        >
                            Back to Cart
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Checkout;
