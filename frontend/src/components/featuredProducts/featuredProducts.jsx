
import { useNavigate } from "react-router-dom";
import "../featuredProducts/featuredProducts.css";
import { useGetAllProductsQuery } from "../../servicesApis/adminProductServices/adminProductServices";
import formatPrice from "../../utils/formatPrice";

const FeaturedProducts = () => {
    const { data, isLoading, isError } = useGetAllProductsQuery();
    const navigate = useNavigate();

    const products = (data?.data || []).slice(0, 8);

    if (isLoading) {
        return <p>Loading products...</p>;
    }

    if (isError) {
        return <p>Unable to load products.</p>;
    }

    return (
        <section className="featured-section">
            <h2>Featured Products</h2>
            <p className="featured-subtitle">
                Discover our delicious bakery favourites
            </p>

            <div className="featured-grid">
                {products.map((product) => (
                    <div
                        className="featured-card"
                        key={product._id}
                        onClick={() =>
                            navigate(`/product/${product._id}`)
                        }
                    >
                        <img
                            src={product.images?.[0]}
                            alt={product.productName}
                        />

                        <div className="featured-info">
                            <h3>{product.productName}</h3>

                            <p className="featured-price">
                                {formatPrice(product.sellingPrice)}
                            </p>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/product-details/${product._id}`);
                                }}
                            >
                                View Product
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FeaturedProducts;
