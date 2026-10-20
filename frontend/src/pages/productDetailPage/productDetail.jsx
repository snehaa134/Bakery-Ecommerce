import { useNavigate, useParams } from "react-router-dom";
import { useGetProductQuery } from "../../servicesApis/adminProductServices/adminProductServices";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs } from "swiper/modules";
import { toast } from "react-toastify";
import "swiper/css";
import formatPrice from "../../utils/formatPrice";
import { useState } from "react";
import "../productDetailPage/productDetail.css"
import { useAddToCartMutation } from "../../servicesApis/cartServices/cartServices";

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const { data, isLoading, isError } = useGetProductQuery(id);
    const [addToCart, { isLoading: loadingOccur }] = useAddToCartMutation();
    const [quantity, setQuantity] = useState(1);
    const product = data?.data;

    if (isLoading) {
        return <p>Loading Product Details</p>
    }

    if (!product) {
        return <p>No Product Details Found</p>
    }

    if (isError) {
        return <p>Unable to Fetch Product Details</p>
    }

 

    const handleAddToCart = async () => {
        try {
            const response = await addToCart({
                productId: product._id,
                quantity: quantity
            }).unwrap();

            toast.success(response?.message);
            navigate("/cart")
        } catch (error) {
                toast.error(error?.data?.message || "failed to Add")
        }
    }

    return (
        <>
            <div className="productDetails-section">
                <div className="images">
                    <Swiper modules={[Thumbs]} thumbs={{ swiper: thumbsSwiper }} spaceBetween={10} >
                        {product?.images.length > 0 ? (
                            product?.images?.map((image, index) => (
                                <SwiperSlide key={index}>
                                    <img src={`http://localhost:5000/uploads/${image}`} alt={product.productName} />
                                </SwiperSlide>
                            ))
                        ) : (
                            <p>Images not found</p>

                        )}

                    </Swiper>

                    <Swiper onSwiper={setThumbsSwiper} slidesPerView={4} spaceBetween={10} watchSlidesProgress>
                        {product?.images?.map((image, index) => (
                            <SwiperSlide key={index}>
                                <img src={`http://localhost:5000/uploads/${image}`} alt={product.productName} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                <div className="content">
                    <h2>{product?.productName}</h2>
                    <h3>{formatPrice(product?.sellingPrice)}</h3>
                    <p>{product?.description}</p>
                    <h4>Stock:{product?.stock}</h4>
                    <div className="quantity">
                        <button onClick={() => setQuantity(quantity - 1)} disabled={quantity <= 1}>-</button>
                        <span>{quantity}</span>
                        <button onClick={() => setQuantity(quantity + 1)} disabled={quantity >= product?.stock}>+</button>
                    </div>
                    <h3>
                        Total Price: {formatPrice(product?.sellingPrice * quantity)}
                    </h3>
                    <button className="buy-btn">Buy Now</button>
                    <button className="add-btn" onClick={handleAddToCart} disabled={loadingOccur}>{loadingOccur ? "adding" : "Add-to-cart"}</button>
                </div>
            </div>
        </>
    )
}
export default ProductDetails;
