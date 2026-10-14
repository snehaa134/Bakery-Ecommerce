
import { useFormik } from "formik";
import * as Yup from "yup";
import {  useGetAllCategoriesQuery } from "../../servicesApis/adminCategoryServices/adminCategoryServices";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAddProductMutation } from "../../servicesApis/adminProductServices/adminProductServices";
const AddProduct = () => {
    const { data, isLoading: isFetching, isError } = useGetAllCategoriesQuery();
    const categories = data?.data || []
    const [addProduct, { isLoading }] = useAddProductMutation();
    const navigate = useNavigate();

    const formik = useFormik({

        initialValues: {
            productName: "",
            description: "",
            sellingPrice: "",
            stock: "",
            category: "",
            image: null
        },
        validationSchema: Yup.object({
            productName: Yup.string().required("productName is required"),
            description: Yup.string().required("description is required"),
            sellingPrice: Yup.number().typeError("Selling price must be a number").required("Selling price is required").positive("Selling price must be greater than 0"),
            image: Yup.mixed().required("image is required"),
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
            formData.append("image", values.image);



            try {
                const response = await addProduct(formData).unwrap();
                console.log("response", response);
                toast.success(response?.message || "Product added successfully");
                formik.resetForm();
                navigate("/manage-Products")

            } catch (error) {
                console.log(error);
                toast.error(error?.data?.message || "failed to add-Product")
            }

        }
    })

    if (isFetching) {
        return <p>Loading Categories</p>
    }

    if (isError) {
        return <p>Failed to load Categories</p>
    }


    return (
        <>
            <div className="main-section">
                <h2>Add Product</h2>

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
                        <input type="file" name="image" placeholder="upload image here"
                            accept="image/*" onChange={(e) => {
                                const selectedImage = e.currentTarget.files[0] || null;
                                formik.setFieldValue("image", selectedImage);
                            }}

                            onBlur={() => formik.setFieldTouched("image", true)}
                        />
                        {formik.touched.image && formik.errors.image && (<p>{formik.errors.image}</p>)}
                    </div>

                    <button type="submit" disabled={isLoading}>{isLoading ? "AddingProduct.." : "Add Product"}</button>


                </form>
            </div>

        </>
    )
}

export default AddProduct;

