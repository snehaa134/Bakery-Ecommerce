import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useGetAllCategoriesQuery, useGetCategoryQuery } from "../../servicesApis/adminCategoryServices/adminCategoryServices";
import formatPrice from "../../utils/formatPrice";
import "../productPage/product.css"
import { useFilterProductsQuery } from "../../servicesApis/adminProductServices/adminProductServices";
import { FaSearch } from "react-icons/fa";
import { useAddToCartMutation } from "../../servicesApis/cartServices/cartServices";
import { toast } from "react-toastify";
const Products = () => {
    const { id } = useParams();
    const { data: allCategoriesData, isLoading: loadingAllCategories, isError: categoriesError } = useGetAllCategoriesQuery();
    const categories = allCategoriesData?.data || [];
    const { data: categoryData, isLoading: loadingCategory, isError: categoryError } = useGetCategoryQuery(id, { skip: !id })
    const category = categoryData?.data

    const [addToCart, { isLoading: loadingCart }] = useAddToCartMutation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "";


    const { data, isLoading, isError } = useFilterProductsQuery({
        category: id || "",
        search,
        sort
    });
    const filteredProducts = data?.data || []


    const handleSearch = (e) => {
        const value = e.target.value
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set("search", value)
        }
        else {
            params.delete("search")
        }
        setSearchParams(params)
    }


    const handleSort = (e) => {
        let value = e.target.value;
        let params = new URLSearchParams(searchParams)

        if (value) {
            params.set("sort", value)
        }
        else {
            params.delete("sort")
        }
        setSearchParams(params)
    }


    if (loadingAllCategories) {
        return <p>Loading Categories..</p>
    }
    if (!categories) {
        return <p>Categories not found</p>
    }


    if (categoriesError) {
        return <p>Something went wrong!</p>
    }


    if (id && loadingCategory) {
        return <p>Loading Category...</p>;
    }

    if (id && categoryError) {
        return <p>Unable to load category</p>;
    }

    if (id && !category) {
        return <p>Category Not Found</p>;
    }
    if (isLoading) {
        return <p>Loading Products..</p>
    }

    if (isError) {
        return <p>Unable to Load Products</p>
    }



    if (!filteredProducts) {
        return <p>Products not found</p>
    }


    const handleAddToCart = async (productId) => {
        try {
            const response = await addToCart({ productId, quantity: 1 }).unwrap();
            toast.success(response.message || "Product added to Cart")
        } catch (error) {
            toast.error(error?.data?.message || "Failed to add")
        }
    }
    return (
        <>

            <div className="product-layout">
                <aside className="product-sidebar">
                    <h3>Category</h3>
                    {categories?.length > 0 ? (
                        categories?.map((category) => (
                            <div key={category._id} className="category">
                                <input type="radio" name="category" value={category._id} checked={id === category._id} onChange={() => navigate(`/products/${category._id}`)} />
                                <span>{category.categoryName || "All Products"}</span>
                            </div>
                        ))
                    ) : (
                        <div className="no-category">
                            <p>No categories found</p>
                        </div>
                    )}

                    <div className="sort-section">
                        <h3>Sort By</h3>
                        <select value={sort} onChange={handleSort}>
                            <option value="">Default Sorting</option>
                            <option value="lowToHigh">Price: Low to High</option>
                            <option value="highToLow">Price: High to Low</option>
                            <option value="aToZ">Name: A to Z</option>
                            <option value="zToA">Name: Z to A</option>
                        </select>
                    </div>
                </aside>


                <div className="main-categories" id="categories">
                    <div className="categoryName">
                        <h2>{category?.categoryName}</h2>
                    </div>

                    <div className="search-input">
                        <input type="text" placeholder="Search Product here" value={search} onChange={handleSearch} className="product-search" />
                        <FaSearch />
                    </div>

                    {filteredProducts.length > 0 ? (
                        <div className="products-grid">
                            {filteredProducts.map((product) => (
                                <div className="product-card" key={product._id}>
                                    <img
                                        src={`http://localhost:5000/uploads/${product?.images[0]}`}
                                        alt={product.productName}
                                    />
                                    <h3>{product.productName}</h3>
                                    <h4>{formatPrice(product.sellingPrice)}</h4>
                                    <button className="view" onClick={() => navigate(`/product-details/${product._id}`)}>View Details</button>
                                    <button className="add" onClick={() => handleAddToCart(product._id)} disabled={loadingCart}>{loadingCart ? "Adding" : "Add to Cart"}</button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="no-products">
                            No products found.
                        </p>
                    )
                    }

                </div>
            </div>

        </>
    )
}

export default Products;



