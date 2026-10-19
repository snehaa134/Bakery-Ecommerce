import { useParams } from "react-router-dom";
import { useGetProductQuery } from "../../servicesApis/adminProductServices/adminProductServices";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs } from "swiper/modules";
import "swiper/css";
import formatPrice from "../../utils/formatPrice";
import { useState } from "react";
import "../productDetailPage/productDetail.css"

const ProductDetails = () => {
    const { id } = useParams();
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const { data, isLoading, isError } = useGetProductQuery(id);
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


    return (
        <>
            <div className="productDetails-section">
                {/* <h2>Product Details</h2> */}
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
                    <button className="add-btn">Add to Cart</button>
                </div>
            </div>
        </>
    )
}
export default ProductDetails;
