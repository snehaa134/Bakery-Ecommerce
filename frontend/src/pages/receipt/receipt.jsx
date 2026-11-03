
import { useParams, useNavigate } from "react-router-dom";
import { useGetOrderByIdQuery } from "../../servicesApis/orderServices/orderServices";
import formatPrice from "../../utils/formatPrice";
import { FaHeart } from "react-icons/fa";
import "../receipt/receipt.css";

const OrderReceipt = () => {
    const { id: orderId } = useParams();
    const navigate = useNavigate();

    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
    } = useGetOrderByIdQuery(orderId, {
        skip: !orderId,
    });

    const order = data?.data;

    if (isLoading) {
        return (
            <div className="receipt-message">
                Loading your receipt...
            </div>
        );
    }

    if (isError) {
        return (
            <div className="receipt-message">
                <h2>Unable to load receipt</h2>

                <p>
                    {error?.data?.message ||
                        "Please check your order and try again."}
                </p>

                <button onClick={refetch}>
                    Try Again
                </button>

                <button onClick={() => navigate("/my-orders")}>
                    My Orders
                </button>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="receipt-message">
                <h2>Receipt not found</h2>

                <p>We could not find this order.</p>

                <button onClick={() => navigate("/my-orders")}>
                    Back to My Orders
                </button>
            </div>
        );
    }

    const subtotal = Number(
        order.subTotal ??
        (order.items || []).reduce(
            (total, item) =>
                total +
                Number(item.price || 0) *
                Number(item.quantity || 0),
            0
        )
    );

    const cgst = Number(
        order.cgst ?? (subtotal * 2.5 / 100).toFixed(2)
    );

    const sgst = Number(
        order.sgst ?? (subtotal * 2.5 / 100).toFixed(2)
    );

    const totalAmount = Number(order.totalAmount || 0);

    const shipping = order.shippingAddress || {};

    const orderDate = order.createdAt
        ? new Date(order.createdAt)
        : null;

    return (
        <section className="receipt-page">

            <div className="receipt-actions no-print">

                <button
                    className="receipt-back-btn"
                    onClick={() => navigate("/my-orders")}
                >
                    ← My Orders
                </button>

                <button
                    className="receipt-print-btn"
                    onClick={() => window.print()}
                >
                    Print / Save PDF
                </button>

            </div>

            <article className="receipt-paper">

                <header className="receipt-header">

                    <div className="receipt-brand-icon">
                        <FaHeart />
                    </div>

                    <h1>Bakery Bliss</h1>

                    <p>Freshly Baked, Made with Love</p>

                    <span className="receipt-badge">
                        ORDER RECEIPT
                    </span>

                </header>

                <div className="receipt-success">

                    <span>✓</span>

                    <div>
                        <h2>Thank you for your order!</h2>
                        <p>Your sweet treats are in good hands.</p>
                    </div>

                </div>

                <div className="receipt-order-details">

                    <div>
                        <span>Order ID</span>

                        <strong>
                            #{order._id.slice(-8).toUpperCase()}
                        </strong>
                    </div>

                    <div>
                        <span>Order Date</span>

                        <strong>
                            {orderDate &&
                                !Number.isNaN(orderDate.getTime())
                                ? orderDate.toLocaleDateString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                })
                                : "N/A"}
                        </strong>
                    </div>

                    <div>
                        <span>Order Status</span>

                        <strong className="receipt-status">
                            {order.orderStatus?.replaceAll("_", " ") || "PLACED"}
                        </strong>
                    </div>

                    <div>
                        <span>Payment Method</span>

                        <strong>
                            {order.paymentMethod === "RAZORPAY"
                                ? "Razorpay"
                                : "Cash on Delivery"}
                        </strong>
                    </div>

                    <div>
                        <span>Payment Status</span>

                        <strong>
                            {order.paymentStatus || "PENDING"}
                        </strong>
                    </div>

                    {order.paymentMethod === "RAZORPAY" &&
                        order.razorpayPaymentId && (
                            <div>
                                <span>Payment ID</span>

                                <strong>
                                    {order.razorpayPaymentId}
                                </strong>
                            </div>
                        )}

                </div>

                <div className="receipt-divider" />

                <h3 className="receipt-section-title">
                    Delivery Address
                </h3>

                <div className="receipt-address">

                    <strong>
                        {shipping.fullName || "Customer"}
                    </strong>

                    <p>{shipping.address}</p>

                    <p>
                        {[
                            shipping.city,
                            shipping.state,
                            shipping.postalCode
                        ]
                            .filter(Boolean)
                            .join(", ")}
                    </p>

                    <p>Phone: {shipping.phone || "N/A"}</p>

                    <p>Email: {shipping.email || "N/A"}</p>

                </div>

                <div className="receipt-divider" />

                <h3 className="receipt-section-title">
                    Order Summary
                </h3>

                <div className="receipt-table-wrap">

                    <table className="receipt-table">

                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Qty</th>
                                <th>Price</th>
                                <th className="receipt-right">
                                    Amount
                                </th>
                            </tr>
                        </thead>

                        <tbody>

                            {(order.items || []).map((item, index) => (

                                <tr
                                    key={`${item.product || item.productName}-${index}`}
                                >
                                    <td>
                                        {item.productName ||
                                            item.product?.productName ||
                                            "Bakery Product"}
                                    </td>

                                    <td>{item.quantity}</td>

                                    <td>
                                        {formatPrice(item.price)}
                                    </td>

                                    <td className="receipt-right">
                                        {formatPrice(
                                            Number(item.price) *
                                            Number(item.quantity)
                                        )}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

                <div className="receipt-totals">

                    <div>
                        <span>Subtotal</span>
                        <span>{formatPrice(subtotal)}</span>
                    </div>

                    <div>
                        <span>CGST (2.5%)</span>
                        <span>{formatPrice(cgst)}</span>
                    </div>

                    <div>
                        <span>SGST (2.5%)</span>
                        <span>{formatPrice(sgst)}</span>
                    </div>

                    <div className="receipt-grand-total">

                        <strong>Total Amount</strong>

                        <strong>
                            {formatPrice(totalAmount)}
                        </strong>

                    </div>

                    <p className="receipt-payment-note">
                        {order.paymentMethod === "RAZORPAY"
                            ? order.paymentStatus === "PAID"
                                ? "Payment successfully completed through Razorpay."
                                : `Payment Status: ${order.paymentStatus}`
                            : "Pay the total amount in cash upon delivery."}
                    </p>

                </div>

                <footer className="receipt-footer">

                    <h3>Made with Love</h3>

                    <p>Thank you for choosing Bakery Bliss!</p>

                    <small>
                        This receipt is generated electronically.
                    </small>

                </footer>

                <div className="receipt-actions receipt-bottom-actions no-print">

                    <button
                        className="receipt-print-btn"
                        onClick={() => window.print()}
                    >
                        Print Receipt
                    </button>

                </div>

            </article>

        </section>
    );
};

export default OrderReceipt;
