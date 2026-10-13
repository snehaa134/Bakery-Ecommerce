import { useGetAllCategoriesQuery } from "../../servicesApis/adminCategoryServices/adminCategoryServices";

const FeaturedCategories = () => {

    const {data,isLoading,isError}= useGetAllCategoriesQuery();
    const categories = data?.data || []
    if(isLoading){
        return <p>Loading categories..</p>
    }

    if(isError){
        return <p>Unable to Load Categories</p>
    }

    if(!categories){
        return <p>Categories not found</p>
    }
    return (
        <>
        <div className="main-categories">

            <h2>Shop By Category</h2>
        </div>

        </>
    )
}

export default FeaturedCategories;