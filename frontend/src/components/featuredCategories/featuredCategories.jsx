import { useGetActiveCategoriesQuery} from "../../servicesApis/adminCategoryServices/adminCategoryServices";
import { useNavigate } from "react-router-dom";
import "../featuredCategories/featuredCategories.css"

const FeaturedCategories = () => {

    const { data, isLoading, isError } = useGetActiveCategoriesQuery();
    const categories = data?.data || []

    const navigate = useNavigate();
    if (isLoading) {
        return <p>Loading c..</p>
    }

    if (isError) {
        return <p>Unable to Load Categories</p>
    }

    if (!categories) {
        return <p>Categories not found</p>
    }
    return (
        <>
            <div className="featured-categories-section" id="categories">

                <h2>Shop By Category</h2>

                {categories?.length > 0 && (
                    <div className="categories-gridd">
                        {categories?.slice(0, 6).map((category) => (
                            <div className="category-card" key={category._id} onClick={() => navigate(`/products/${category._id}`)}>
                                <img src={category.image} alt={category.categoryName} />
                                <h3>{category.categoryName}</h3>
                            </div>

                        ))}
                    </div>
                )}
            </div >

        </>
    )
}

export default FeaturedCategories;