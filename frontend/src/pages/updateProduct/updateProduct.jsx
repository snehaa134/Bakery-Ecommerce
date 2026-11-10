
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetProductQuery, useUpdateProductMutation } from "../../servicesApis/adminProductServices/adminProductServices";
import { useGetAllCategoriesQuery } from "../../servicesApis/adminCategoryServices/adminCategoryServices";
import "../updateProduct/updateProduct.css";

const UpdateProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [existingImages, setExistingImages] = useState([]);
    const { data, isLoading: isFetching } = useGetProductQuery(id);
    const product = data?.data;
    const [updateProduct, { isLoading }] = useUpdateProductMutation();
    const { data: categoriesData, isLoading: isCategoriesLoading, isError } = useGetAllCategoriesQuery();
    const categories = categoriesData?.data || [];


    useEffect(() => {
        if (product) {
            setExistingImages(product.images || []);
        }
    }, [product]);



    const formik = useFormik({
        enableReinitialize: true,

        initialValues: {
            productName: product?.productName || "",
            description: product?.description || "",
            sellingPrice: product?.sellingPrice ?? "",
            stock: product?.stock ?? "",
            category: product?.category?._id || "",
            images: []
        },

        validationSchema: Yup.object({
            productName: Yup.string()
                .required("Product name is required"),

            description: Yup.string()
                .required("Description is required"),

            sellingPrice: Yup.number()
                .typeError("Price must be a number")
                .required("Price is required")
                .positive("Price must be greater than 0"),

            stock: Yup.number()
                .typeError("Stock must be a number")
                .required("Stock is required")
                .integer("Stock must be an integer")
                .min(0, "Stock cannot be negative"),

            category: Yup.string()
                .required("Please select a category"),

            images: Yup.array()
                .max(6, "Maximum 6 new images allowed")
        }),

        onSubmit: async (values) => {
            const formData = new FormData();

            formData.append("productName", values.productName);
            formData.append("description", values.description);
            formData.append("sellingPrice", values.sellingPrice);
            formData.append("stock", values.stock);
            formData.append("category", values.category);

            formData.append(
                "existingImages",
                JSON.stringify(existingImages)
            );

            values.images.forEach((image) => {
                formData.append("images", image);
            });

            try {
                const response = await updateProduct({
                    id,
                    formData
                }).unwrap();
                toast.success(response?.message || "Product updated successfully");
                navigate("/manage-products");
            } catch (error) {
                toast.error(
                    error?.data?.message || "Failed to update product"
                );
            }
        }
    });

    if (isFetching) {
        return <p>Loading product...</p>;
    }

    if (!product) {
        return <p>Product not found.</p>;
    }

    if (isCategoriesLoading) {
        return <p>Loading categories...</p>;
    }

    if (isError) {
        return <p>Something went wrong!</p>;
    }

    return (
        <div className="update-product">
            <h2>Update Product</h2>

            <form onSubmit={formik.handleSubmit}>

                <div className="form-group">
                    <label>Product Name:</label>
                    <input
                        type="text"
                        name="productName"
                        placeholder="Enter product name"
                        value={formik.values.productName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />

                    {formik.touched.productName &&
                        formik.errors.productName && (
                            <p>{formik.errors.productName}</p>
                        )}
                </div>

                <div className="form-group">
                    <label>Product Description:</label>
                    <input
                        type="text"
                        name="description"
                        placeholder="Enter description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />

                    {formik.touched.description &&
                        formik.errors.description && (
                            <p>{formik.errors.description}</p>
                        )}
                </div>

                <div className="form-group">
                    <label>Product SellingPrice:</label>
                    <input
                        type="number"
                        name="sellingPrice"
                        placeholder="Enter selling price"
                        value={formik.values.sellingPrice}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />

                    {formik.touched.sellingPrice &&
                        formik.errors.sellingPrice && (
                            <p>{formik.errors.sellingPrice}</p>
                        )}
                </div>

                <div className="form-group">
                    <label>Product Stock:</label>
                    <input
                        type="number"
                        name="stock"
                        placeholder="Enter stock"
                        value={formik.values.stock}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />

                    {formik.touched.stock &&
                        formik.errors.stock && (
                            <p>{formik.errors.stock}</p>
                        )}
                </div>

                <div className="form-group">
                    <label>Select Product Category</label>
                    <select
                        name="category"
                        value={formik.values.category}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    >
                        <option value="">Select Category</option>

                        {categories.map((category) => (
                            <option
                                key={category._id}
                                value={category._id}
                            >
                                {category.categoryName}
                            </option>
                        ))}
                    </select>

                    {formik.touched.category &&
                        formik.errors.category && (
                            <p>{formik.errors.category}</p>
                        )}
                </div>

                <div className="form-group">
                    <label>Current Product Images:</label>

                    {existingImages.length > 0 ? (
                        existingImages.map((image) => (
                            <div key={image}>
                                <img
                                    src={image}
                                    alt="Product"
                                    className="productImage"
                                    width="60"
                                />

                                <button
                                    type="button"
                                    onClick={() => {
                                        setExistingImages(
                                            existingImages.filter((img) => img !== image)
                                        );
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No existing images</p>
                    )}
                </div>

                <div className="form-group">
                    <label>Upload New Images:</label>

                    <input
                        type="file"
                        name="images"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                            formik.setFieldValue(
                                "images",
                                Array.from(e.target.files || [])
                            );
                        }}
                        onBlur={() => {
                            formik.setFieldTouched("images", true);
                        }}
                    />

                    {formik.values.images.length > 0 && (
                        <p>
                            {formik.values.images.length} new images selected
                        </p>
                    )}

                    {formik.touched.images &&
                        formik.errors.images && (
                            <p>{formik.errors.images}</p>
                        )}
                </div>

                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Updating Product..." : "Update Product"}
                </button>

            </form>
        </div>
    );
};

export default UpdateProduct;
