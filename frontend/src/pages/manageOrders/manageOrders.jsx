
import { useState } from "react";
import { toast } from "react-toastify";
import {
    useGetOrdersQuery,
    useUpdateOrderStatusMutation,
} from "../../servicesApis/orderServices/orderServices";
import "../manageOrders/manageOrders.css";
const orderStatuses = [
    "PLACED",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
];

const ManageOrders = () => {
    const { data, isLoading, isError } = useGetOrdersQuery();
    const [updateOrderStatus] = useUpdateOrderStatusMutation();

    const [updatingId, setUpdatingId] = useState(null);

    const orders = data?.data || [];

    const handleStatusUpdate = async (id, status) => {
        try {
            setUpdatingId(id);

            const response = await updateOrderStatus({
                id,
                status,
            }).unwrap();

            toast.success(
                response?.message || "Order status updated successfully"
            );
        } catch (error) {
            toast.error(
                error?.data?.message || "Failed to update order status"
            );
        } finally {
            setUpdatingId(null);
        }
    };

    if (isLoading) {
        return (
            <div className="manage-orders-message">
                Loading orders...
            </div>
        );
    }

    if (isError) {
        return (
            <div className="manage-orders-message">
                Failed to load orders. Please try again.
            </div>
        );
    }

    return (
        <div className="manage-orders">
            <div className="manage-orders-header">
                <div>
                    <h2>Manage Orders</h2>
                    <p>Track and manage all customer orders.</p>
                </div>

                <div className="orders-count">
                    Total Orders <span>{orders.length}</span>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="manage-orders-empty">
                    <div className="empty-order-icon">♡</div>
                    <h3>No Orders Yet</h3>
                    <p>Customer orders will appear here.</p>
                </div>
            ) : (
                <div className="orders-table-wrapper">
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer Details</th>
                                <th>Products</th>
                                <th>Total Amount</th>
                                <th>Payment</th>
                                <th>Order Status</th>
                                <th>Update Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id}>
                                    <td>
                                        <span className="order-id">
                                            #{order._id.slice(-6).toUpperCase()}
                                        </span>
                                        <small className="order-date">
                                            {order.createdAt
                                                ? new Date(
                                                      order.createdAt
                                                  ).toLocaleDateString("en-IN")
                                                : ""}
                                        </small>
                                    </td>

                                    <td>
                                        <div className="order-customer">
                                            <strong>
                                                {order.shippingAddress?.fullName ||
                                                    order.user?.name ||
                                                    "Guest"}
                                            </strong>
                                            <span>
                                                {order.shippingAddress?.email ||
                                                    order.user?.email ||
                                                    "N/A"}
                                            </span>
                                            <span>
                                                {order.shippingAddress?.phone ||
                                                    "N/A"}
                                            </span>
                                            <small>
                                                {[
                                                    order.shippingAddress?.city,
                                                    order.shippingAddress?.state,
                                                ]
                                                    .filter(Boolean)
                                                    .join(", ")}
                                            </small>
                                        </div>
                                    </td>

                                    <td>
                                        <div className="order-products">
                                            {order.items?.map((item, index) => (
                                                <div
                                                    key={
                                                        item._id ||
                                                        `${item.product}-${index}`
                                                    }
                                                >
                                                    <span>
                                                        {item.productName ||
                                                            item.product
                                                                ?.productName ||
                                                            "Product"}
                                                    </span>
                                                    <small>
                                                        × {item.quantity}
                                                    </small>
                                                </div>
                                            ))}
                                        </div>
                                    </td>

                                    <td className="order-total">
                                        ₹
                                        {Number(
                                            order.totalAmount || 0
                                        ).toFixed(2)}
                                    </td>

                                    <td>
                                        <span
                                            className={`payment-status ${String(
                                                order.paymentStatus || "PENDING"
                                            ).toLowerCase()}`}
                                        >
                                            {order.paymentStatus || "PENDING"}
                                        </span>
                                        <small className="payment-method">
                                            {order.paymentMethod || "COD"}
                                        </small>
                                    </td>

                                    <td>
                                        <span
                                            className={`order-status status-${String(
                                                order.orderStatus || "PLACED"
                                            )
                                                .toLowerCase()
                                                .replace(/\s+/g, "-")}`}
                                        >
                                            {order.orderStatus || "PLACED"}
                                        </span>
                                    </td>

                                    <td>
                                        <select
                                            className="order-status-select"
                                            value={
                                                order.orderStatus || "PLACED"
                                            }
                                            disabled={updatingId === order._id}
                                            onChange={(e) =>
                                                handleStatusUpdate(
                                                    order._id,
                                                    e.target.value
                                                )
                                            }
                                        >
                                            {orderStatuses.map((status) => (
                                                <option
                                                    key={status}
                                                    value={status}
                                                >
                                                    {status}
                                                </option>
                                            ))}
                                        </select>

                                        {updatingId === order._id && (
                                            <small className="updating-text">
                                                Updating...
                                            </small>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ManageOrders;