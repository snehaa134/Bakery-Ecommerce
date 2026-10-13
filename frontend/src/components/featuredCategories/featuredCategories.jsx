import { useGetAllCategoriesQuery } from "../../servicesApis/adminCategoryServices/adminCategoryServices";
import "../featuredCategories/featuredCategories.css"

const FeaturedCategories = () => {

    const { data, isLoading, isError } = useGetAllCategoriesQuery();
    const categories = data?.data || []
    if (isLoading) {
        return <p>Loading categories..</p>
    }

    if (isError) {
        return <p>Unable to Load Categories</p>
    }

    if (!categories) {
        return <p>Categories not found</p>
    }
    return (
        <>
            <div className="main-categories" id="categories">

                <h2>Shop By Category</h2>

                {categories?.length > 0 && (
                    <div className="categories-grid">
                        {categories?.slice(0, 6).map((category) => (
                            <div className="category-card" key={category._id}>
                                <img src={`http://localhost:5000/uploads/${category.image}`} alt={category.categoryName} />
                                <h3>{category.categoryName}</h3>
                            </div>

                        ))}
                    </div>
                )}
            </div>

        </>
    )
}

export default FeaturedCategories;