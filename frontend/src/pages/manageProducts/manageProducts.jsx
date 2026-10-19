import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import formatPrice from "../../utils/formatPrice";
import { useDeleteProductMutation, useGetAllProductsQuery } from "../../servicesApis/adminProductServices/adminProductServices";
import "../manageProducts/manageProducts.css";

const ManageProducts = () => {

    const { data, isLoading, isError } = useGetAllProductsQuery();
    const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
    const navigate = useNavigate();
    const products = data?.data || [];
    console.log("products",products)

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this Product?"
        )

        if (!confirmDelete) return;

        try {
            const response = await deleteProduct(id).unwrap();
            console.log("response", response);
            toast.success(response?.message || "Product deleted successfully");

        } catch (error) {
            console.log(error);
            toast.error(error?.data?.message || "Something went wrong")
        }

    }

    if (isLoading) {
        return <p>Loading Products..</p>
    }

    if (isError) {
        return <p>Something went wrong!</p>
    }


    return (
        <>
            <div className="manage-products">
                <h2>Manage Products</h2>

                <button type="button" onClick={() => navigate("/add-product")}>+ Add Product</button>

                <div className="table">
                    <table border="1">
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Images</th>
                                <th>Product Name</th>
                                <th>Product Category</th>
                                <th>Selling Price</th>
                                <th>Stock</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {products?.length > 0 ? (
                                products?.map((product, index) => (
                                    <tr key={product?._id}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <img src={`http://localhost:5000/uploads/${product?.images[0]}`} alt={product?.productName} width="60" />
                                        </td>
                                        <td>{product?.productName}</td>
                                        <td>{product?.category?.categoryName}</td>
                                        <td>{formatPrice(product?.sellingPrice)}</td>
                                        <td>{product?.stock}</td>

                                        <td className="product-actions">
                                            <button type="button" onClick={() => navigate(`/update-product/${product._id}`)}>Edit</button>
                                            <button type="button" disabled={isDeleting} onClick={() => handleDelete(product._id)}>{isDeleting ? "Deleting.." : "Delete"}</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7">No Products Found</td>
                                </tr>

                            )}


                        </tbody>
                    </table>

                </div>
            </div>
        </>
    )
}

export default ManageProducts;