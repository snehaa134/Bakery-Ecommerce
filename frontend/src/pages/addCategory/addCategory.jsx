
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAddCategoryMutation } from "../../servicesApis/adminCategoryServices/adminCategoryServices";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../addCategory/addCategory.css"
const AddCategory = () => {
    const [addCategory, { isLoading }] = useAddCategoryMutation();
    const navigate = useNavigate();

    const formik = useFormik({

        initialValues: {
            categoryName: "",
            description: "",
            image: null
        },
        validationSchema: Yup.object({
            categoryName: Yup.string().required("categoryName is required"),
            description: Yup.string().required("description is required"),
            image: Yup.mixed().required("image is required")
        }),
        onSubmit: async (values) => {

            const formData = new FormData();
            formData.append("categoryName", values.categoryName);
            formData.append("description", values.description);
            formData.append("image", values.image);


            try {
                const response = await addCategory(formData).unwrap();
                console.log("response", response);
                toast.success(response?.message || "category added successfully");
                formik.resetForm();
                navigate("/manage-categories")

            } catch (error) {
                console.log(error);
                toast.error(error?.data?.message || "failed to add-category")
            }

        }
    })


    return (
        <>
            <div className="main-section">
                <h2>Add Category</h2>

                <form onSubmit={formik.handleSubmit}>
                    <div className="form-group">
                        <input type="text" name="categoryName" placeholder="Enter category name" value={formik.values.categoryName} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                        {formik.touched.categoryName && formik.errors.categoryName && (<p>{formik.errors.categoryName}</p>)}
                    </div>

                    <div className="form-group">
                        <input type="text" name="description" placeholder="Enter description here" value={formik.values.description} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                        {formik.touched.description && formik.errors.description && (<p>{formik.errors.description}</p>)}
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

                    <button type="submit" disabled={isLoading}>{isLoading ? "AddingCategory.." : "Add Category"}</button>


                </form>
            </div>

        </>
    )
}

export default AddCategory;


