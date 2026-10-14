

import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetProductQuery, useUpdateProductMutation } from "../../servicesApis/adminProductServices/adminProductServices";
const UpdateProduct = () => {
    const { id } = useParams();
    const { data, isLoading: isFetching } = useGetProductQuery(id);
    const [updateProduct, { isLoading }] = useUpdateProductMutation();
    const { categoriesData, isLoading: isCategoriesLoading, isError } = useGetAllCategoriesQuery();
    const categories = categoriesData?.data || []

    const product = data?.data;
    const navigate = useNavigate();

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            productName: product?.productName || "",
            description: product?.description || "",
            sellingPrice: product?.sellingPrice || "",
            stock: product?.stock || "",
            category: product?.category || "",
            image: null
        },
        validationSchema: Yup.object({
            productName: Yup.string().required("productName is required"),
            description: Yup.string().required("description is required"),
            sellingPrice: Yup.number().typeError("Selling price must be a number").required("Selling price is required").positive("Selling price must be greater than 0"),
            image: Yup.mixed().nullable(),
            stock: Yup.number().typeError("stock must be a number").required("stock is required").integer("Stock must be an integer").min(0, "stock cannot be negative"),
            category: Yup.string().required("Please select a category")
        }),
        onSubmit: async (values) => {

            const formData = new FormData();
            formData.append("productName", values.productName);
            formData.append("description", values.description);
            formData.append("sellingPrice", values.sellingPrice);
            formData.append("stock", values.stock);
            formData.append("category", values.category);
            if (values.image) {
                formData.append("image", values.image);
            }


            try {
                const response = await updateProduct({ id, formData }).unwrap();
                console.log("response", response);
                toast.success(response?.message || "Product updated successfully");
                formik.resetForm();
                navigate("/manage-categories")

            } catch (error) {
                console.log(error);
                toast.error(error?.data?.message || "failed to update-Product")
            }

        }
    })

    if (isFetching) {
        return <p>Loading Product..</p>
    }

    if (isCategoriesLoading) {
        return <p>Loading Categories..</p>
    }

    if (isError) {
        return <p>Something went wrong!</p>
    }


    return (
        <>
            <div className="main-category">
                <h2>Update Product</h2>

                <form onSubmit={formik.handleSubmit}>
                    <div className="form-group">
                        <input type="text" name="productName" placeholder="Enter product Name" value={formik.values.productName} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                        {formik.touched.productName && formik.errors.productName && (<p>{formik.errors.productName}</p>)}
                    </div>


                    <div className="form-group">
                        <input type="text" name="description" placeholder="Enter description here" value={formik.values.description} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                        {formik.touched.description && formik.errors.description && (<p>{formik.errors.description}</p>)}
                    </div>

                    <div className="form-group">
                        <input type="number" name="sellingPrice" placeholder="Enter Product Selling Price" value={formik.values.sellingPrice} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                        {formik.touched.sellingPrice && formik.errors.sellingPrice && (<p>{formik.errors.sellingPrice}</p>)}
                    </div>

                    <div className="form-group">
                        <input type="number" name="stock" placeholder="Enter Stock " value={formik.values.stock} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                        {formik.touched.stock && formik.errors.stock && (<p>{formik.errors.stock}</p>)}
                    </div>


                    <div className="form-group">
                        <select name="category" value={formik.values.category} onChange={formik.handleChange} onBlur={formik.handleBlur}>

                            <option value="">Select Category</option>
                            {categories?.map((category) => (
                                <option key={category._id} value={category._id}>
                                    {category.categoryName}
                                </option>
                            ))}
                        </select>
                        {formik.touched.category && formik.errors.category && (<p>{formik.errors.category}</p>)}
                    </div>


                    <div className="form-group">
                        <label>Image:</label>
                        {category?.image && (
                            <img src={`http://localhost:5000/uploads/${category?.image}`} alt={category.categoryName} width="60" />
                        )}
                        <input type="file" name="image" placeholder="upload image here"
                            accept="image/*" onChange={(e) => {
                                const selectedImage = e.currentTarget.files[0] || null;
                                formik.setFieldValue("image", selectedImage);
                            }}

                            onBlur={() => formik.setFieldTouched("image", true)}
                        />
                        {formik.touched.image && formik.errors.image && (<p>{formik.errors.image}</p>)}
                    </div>

                    <button type="submit" disabled={isLoading}>{isLoading ? "UpdatingProduct.." : "Update Product"}</button>


                </form>
            </div>

        </>
    )
}

export default UpdateProduct;