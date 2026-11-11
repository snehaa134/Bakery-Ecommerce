import { useGetCartQuery, useRemoveProductMutation, useUpdateQuantityMutation } from "../../servicesApis/cartServices/cartServices";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../cart/cart.css";

const Cart = () => {
    const { data, isLoading } = useGetCartQuery();
    const [updateQuantity] = useUpdateQuantityMutation();
    const [removeProduct] = useRemoveProductMutation();
    const navigate = useNavigate();

    const items = data?.data?.items || []



    if (isLoading) {
        return <p>Loading Cart</p>
    }


    const handleRemove = async (productId) => {
        try {
            const response = await removeProduct(productId).unwrap();
            toast.success(response?.message || "Prduct Removed from cart")

        } catch (error) {
            toast.error(error?.data?.message || "Failed to Remove")

        }
    }

    const handleQuantity = async (productId, quantity) => {
        try {
            const response = await updateQuantity({ productId, quantity }).unwrap();
            toast.success(response?.message || "quantity updated ")

        } catch (error) {
            toast.error(error?.data?.message || "failed to update")

        }
    }

    const total = items.reduce((sum, item) => {
        return sum + item.product.sellingPrice * item.quantity
    }, 0)


    return (
        <>
            <div className="main-cart">
                <h2>My Cart</h2>

                {items?.length === 0 ? (
                    <>
                        <p>Cart is Empty</p>
                        <div className="continue-shopping-btn">
                            <button onClick={() => navigate("/products")}>Continue Shopping</button>
                        </div>
                    </>

                ) : (
                    items?.map((item) => {
                        const product = item.product;
                        const productId = product._id;

                        const subtotal = product.sellingPrice * item.quantity

                        return (
                            <div className="cart-items" key={productId}>
                                <img src={product.images?.[0]} alt={product.productName} />

                                <div className="cart-details">
                                    <h2>{product?.productName}</h2>
                                    <h3>Price:{product?.sellingPrice}</h3>

                                    <button onClick={() => {
                                        if (item.quantity === 1) {
                                            handleRemove(productId)
                                        } else {
                                            handleQuantity(productId, item.quantity - 1)
                                        }
                                    }}>-</button>
                                    <span>{item.quantity}</span>
                                    <button disabled={item.quantity > product.stock} onClick={() => handleQuantity(productId, item.quantity + 1)}>+</button>

                                    <p>SubTotal:{subtotal}</p>

                                    <button onClick={() => handleRemove(productId)}>Remove</button>
                                </div>

                            </div>


                        )
                    }

                    )
                )}

                <div className="cart-total">
                    <h3>Total:{total}</h3>
                </div>

                <div className="proceed-to-payment-btn">
                    <button onClick={() => navigate("/checkout")}>Proceed to Checkout</button>
                </div>


            </div>

        </>
    )
}
export default Cart;