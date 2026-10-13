
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAddCategoryMutation, useGetCategoryQuery, useUpdateCategoryMutation } from "../../servicesApis/adminCategoryServices/adminCategoryServices";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
const UpdateCategory = () => {
    const { id } = useParams();
    const { data, isLoading: isFetching } = useGetCategoryQuery(id);
    const [updateCategory, { isLoading }] = useUpdateCategoryMutation();

    const category = data?.data;
    const navigate = useNavigate();

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            categoryName: category?.categoryName || "",
            description: category?.description || "",
            image: null
        },
        validationSchema: Yup.object({
            categoryName: Yup.string().required("categoryName is required"),
            description: Yup.string().required("description is required"),
            image: Yup.mixed().nullable()
        }),
        onSubmit: async (values) => {

            const formData = new FormData();
            formData.append("categoryName", values.categoryName);
            formData.append("description", values.description);
            if (values.image) {
                formData.append("image", values.image);
            }


            try {
                const response = await updateCategory({ id, formData }).unwrap();
                console.log("response", response);
                toast.success(response?.message || "category updated successfully");
                formik.resetForm();
                navigate("/manage-categories")

            } catch (error) {
                console.log(error);
                toast.error(error?.data?.message || "failed to update-category")
            }

        }
    })

    if (isFetching) {
        return <p>Loading Category..</p>
    }


    return (
        <>
            <div className="main-category">
                <h2>Update Category</h2>

                <form onSubmit={formik.handleSubmit}>
                    <div className="form-group">
                        <label>Category Name:</label>
                        <input type="text" name="categoryName" placeholder="Enter category name" value={formik.values.categoryName} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                        {formik.touched.categoryName && formik.errors.categoryName && (<p>{formik.errors.categoryName}</p>)}
                    </div>

                    <div className="form-group">
                        <label>Category Description:</label>
                        <input type="text" name="description" placeholder="Enter description here" value={formik.values.description} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                        {formik.touched.description && formik.errors.description && (<p>{formik.errors.description}</p>)}
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

                    <button type="submit" disabled={isLoading}>{isLoading ? "UpdatingCategory.." : "Update Category"}</button>


                </form>
            </div>

        </>
    )
}

export default UpdateCategory;