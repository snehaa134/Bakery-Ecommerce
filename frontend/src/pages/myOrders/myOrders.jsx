
import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../servicesApis/orderServices/orderServices";
import formatPrice from "../../utils/formatPrice";
import "./myOrders.css";

const MyOrders = () => {
    const { data, isLoading, isError, refetch } =
        useGetMyOrdersQuery();

    const orders = data?.data || [];

    if (isLoading) {
        return (
            <div className="orders-message">
                Loading your orders...
            </div>
        );
    }

    if (isError) {
        return (
            <div className="orders-message">
                <p>Unable to load your orders.</p>
                <button onClick={refetch}>Try Again</button>
            </div>
        );
    }

    return (
        <section className="my-orders">
            <div className="orders-header">
                <span className="orders-subtitle">
                    BAKERY BLISS
                </span>

                <h1>My Orders</h1>

                <p>
                    Track your sweet treats and order details.
                </p>
            </div>

            {orders.length === 0 ? (
                <div className="empty-orders">
                    <div className="empty-orders-icon">♡</div>

                    <h2>No orders yet!</h2>

                    <p>
                        Your delicious Bakery Bliss orders
                        will appear here.
                    </p>

                    <Link
                        to="/shop"
                        className="shop-orders-btn"
                    >
                        Explore Products
                    </Link>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => (
                        <article
                            className="order-card"
                            key={order._id}
                        >
                            <div className="order-card-header">
                                <div>
                                    <span className="order-label">
                                        ORDER ID
                                    </span>

                                    <h3>
                                        #{order._id.slice(-8).toUpperCase()}
                                    </h3>

                                    <p className="order-date">
                                        {new Date(
                                            order.createdAt
                                        ).toLocaleDateString("en-IN", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>

                                <span
                                    className={`order-status status-${order.orderStatus?.toLowerCase()}`}
                                >
                                    {order.orderStatus?.replaceAll(
                                        "_",
                                        " "
                                    )}
                                </span>
                            </div>

                            <div className="order-products">
                                {order.items?.map((item, index) => (
                                    <div
                                        className="order-product"
                                        key={`${
                                            item.product ||
                                            item.productName
                                        }-${index}`}
                                    >
                                        <div className="order-product-icon">
                                            ♡
                                        </div>

                                        <div className="order-product-info">
                                            <h4>
                                                {item.productName ||
                                                    item.product
                                                        ?.productName ||
                                                    "Bakery product"}
                                            </h4>

                                            <p>
                                                Qty: {item.quantity}
                                                {" × "}
                                                {formatPrice(item.price)}
                                            </p>
                                        </div>

                                        <strong>
                                            {formatPrice(
                                                item.price * item.quantity
                                            )}
                                        </strong>
                                    </div>
                                ))}
                            </div>

                            <div className="order-card-footer">
                                <div className="order-payment">
                                    <span>Payment</span>

                                    <strong>
                                        {order.paymentMethod === "RAZORPAY"
                                            ? "Razorpay"
                                            : "Cash on Delivery"}
                                    </strong>

                                    <small>
                                        {order.paymentStatus}
                                    </small>
                                </div>

                                <div className="order-total">
                                    <span>Total Amount</span>

                                    <h3>
                                        {formatPrice(order.totalAmount)}
                                    </h3>
                                </div>
                            </div>

                            <div className="order-receipt-actions">
                                <Link
                                    to={`/order-receipt/${order._id}`}
                                    className="order-receipt-btn"
                                >
                                    View Receipt
                                    <span> →</span>
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
};

export default MyOrders;
