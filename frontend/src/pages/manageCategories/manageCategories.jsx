import { useNavigate } from "react-router-dom";
import { useDeleteCategoryMutation, useGetAllCategoriesQuery } from "../../servicesApis/adminCategoryServices/adminCategoryServices";
import { toast } from "react-toastify";
import "../manageCategories/manageCategories.css";


const ManageCategories = () => {

    const { data, isLoading, isError } = useGetAllCategoriesQuery();
    const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();
    const navigate = useNavigate();
    const categories = data?.data || [];

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this category?"
        )

        if (!confirmDelete) return;

        try {
            const response = await deleteCategory(id).unwrap();
            console.log("response", response);
            toast.success(response?.message || "category deleted successfully");

        } catch (error) {
            console.log(error);
            toast.error(error?.data?.message || "Something went wrong")
        }

    }

    if (isLoading) {
        return <p>Loading categories..</p>
    }

    if (isError) {
        return <p>Something went wrong!</p>
    }


    return (
        <>
            <div className="manage-categories">
                <h2>Manage Categories</h2>

                <button type="button" onClick={() => navigate("/add-category")}>+ Add Category</button>

                <div className="table">
                    <table border="1">
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Category Name</th>
                                <th>image</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {categories?.length > 0 ? (
                                categories.map((category, index) => (
                                    <tr key={category._id}>
                                        <td>{index + 1}</td>
                                        <td>{category.categoryName}</td>
                                        <td>
                                            <img src={`http://localhost:5000/uploads/${category.image}`} alt={category.categoryName} width="60" />
                                        </td>
                                        <td>
                                            <button type="button" onClick={() => navigate(`/update-category/${category._id}`)}>Edit</button>
                                            <button type="button" disabled={isDeleting} onClick={() => handleDelete(category._id)}>{isDeleting ? "Deleting.." : "Delete"}</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4">No Categories Found</td>
                                </tr>

                            )}


                        </tbody>
                    </table>

                    <button onClick={()=>navigate("/manage-banners")}>Manage Banners</button>
                </div>
            </div>
        </>
    )
}

export default ManageCategories;