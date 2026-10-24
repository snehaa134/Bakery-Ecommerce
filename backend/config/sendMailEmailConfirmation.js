
const sendMail = require("../config/mailer")
const escapeHtml = (value = "") =>
    String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);

const sendOrderConfirmationEmail = async ({
    to,
    orderId,
    fullName,
    items,
    totalAmount
}) => {
    const productRows = items.map(item => `
        <tr>
            <td style="padding:12px;border-bottom:1px solid #eee">
                ${escapeHtml(item.productName)}
            </td>
            <td style="padding:12px;border-bottom:1px solid #eee">
                ${item.quantity}
            </td>
            <td style="padding:12px;border-bottom:1px solid #eee">
                ₹${(item.price * item.quantity).toFixed(2)}
            </td>
        </tr>
    `).join("");

    const html = `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#333;border:1px solid #f3d6e1;border-radius:12px;overflow:hidden">

            <div style="background:#fce7ef;padding:24px;text-align:center">
                <h1 style="color:#a83260;margin:0">Bakery Bliss</h1>
                <h2>Order Placed Successfully!</h2>
            </div>

            <div style="padding:24px">
                <p>Hi ${escapeHtml(fullName)},</p>

                <p>Thank you for shopping with Bakery Bliss!
                Your order has been placed successfully.</p>

                <p><strong>Order ID:</strong> ${escapeHtml(orderId)}</p>

                <p><strong>Payment Method:</strong> Cash on Delivery</p>

                <h3>Order Summary</h3>

                <table style="width:100%;border-collapse:collapse;text-align:left">
                    <thead>
                        <tr>
                            <th style="padding:12px">Product</th>
                            <th style="padding:12px">Qty</th>
                            <th style="padding:12px">Price</th>
                        </tr>
                    </thead>
                    <tbody>${productRows}</tbody>
                </table>

                <h3 style="text-align:right;color:#a83260">
                    Total: ₹${Number(totalAmount).toFixed(2)}
                </h3>

                <p>Payment will be collected when your order is delivered.</p>

                <p>Thank you for choosing Bakery Bliss! ❤️</p>
            </div>
        </div>
    `;

    return sendMail(
        to,
        `Bakery Bliss - Order Confirmed #${orderId}`,
        html
    );
};

module.exports = sendOrderConfirmationEmail;
