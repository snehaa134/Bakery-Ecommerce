import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../manageCategories/manageCategories.css";
import { useDeleteBannerMutation, useGetAllBannersQuery } from "../../servicesApis/bannerServices/bannerServices";
import "../manageBanners/manageBanners.css"


const ManageBanners = () => {

    const { data, isLoading, isError } = useGetAllBannersQuery();
    const [deleteBanner, { isLoading: isDeleting }] = useDeleteBannerMutation();
    const navigate = useNavigate();
    const banners = data?.data || [];

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this banner?"
        )

        if (!confirmDelete) return;

        try {
            const response = await deleteBanner(id).unwrap();
            console.log("response", response);
            toast.success(response?.message || "Banner deleted successfully");

        } catch (error) {
            console.log(error);
            toast.error(error?.data?.message || "Something went wrong")
        }

    }

    if (isLoading) {
        return <p>Loading Banner..</p>
    }

    if (isError) {
        return <p>Something went wrong!</p>
    }


    return (
        <>
            <div className="manage-categories">
                <h2>Manage Banners</h2>

                <button type="button" onClick={() => navigate("/add-banner")}>+ Add Banner</button>

                <div className="table">
                    <table border="1">
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Title</th>
                                <th>Images</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {banners?.length > 0 ? (
                                banners.map((banner, index) => (
                                    <tr key={banner._id}>
                                        <td>{index + 1}</td>
                                        <td>{banner.title}</td>
                                        <td>
                                            {banner.images?.length > 0 ? (
                                                <div className="banner-images">
                                                    {banner.images.map((image, imageIndex) => (
                                                        <img
                                                            key={imageIndex}
                                                            src={`http://localhost:5000/uploads/${image}`}
                                                            alt={`${banner.title} ${imageIndex + 1}`}
                                                            width="100"
                                                        />
                                                    ))}
                                                </div>
                                            ) : (
                                                <p>No image</p>
                                            )}
                                        </td>
                                        <td>
                                            <button type="button" onClick={() => navigate(`/update-banner/${banner._id}`)}>Edit</button>
                                            <button type="button" disabled={isDeleting} onClick={() => handleDelete(banner._id)}>{isDeleting ? "Deleting.." : "Delete"}</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4">No Banners Found</td>
                                </tr>

                            )}


                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default ManageBanners;