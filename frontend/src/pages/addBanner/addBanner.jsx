
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAddBannerMutation } from "../../servicesApis/bannerServices/bannerServices";
const AddBanner = () => {
    const [AddBanner, { isLoading }] = useAddBannerMutation();
    const navigate = useNavigate();

    const formik = useFormik({

        initialValues: {
            title: "",
            description: "",
            images: []
        },
        validationSchema: Yup.object({
            title: Yup.string().required("title is required"),
            description: Yup.string().required("description is required"),
            images: Yup.array().min(1, "Please select at least one image").required("images are required")
        }),
        onSubmit: async (values) => {

            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("description", values.description);

            values.images.forEach((image) => {
                formData.append("images", image)
            })


            try {
                const response = await AddBanner(formData).unwrap();
                console.log("response", response);
                toast.success(response?.message || "Banner added successfully");
                formik.resetForm();
                navigate("/manage-banners")

            } catch (error) {
                console.log(error);
                toast.error(error?.data?.message || "failed to add-banner")
            }

        }
    })


    return (
        <>
            <div className="main-section">
                <h2>Add Banner</h2>

                <form onSubmit={formik.handleSubmit}>
                    <div className="form-group">
                        <input type="text" name="title" placeholder="Enter Banner title here" value={formik.values.title} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                        {formik.touched.title && formik.errors.title && (<p>{formik.errors.title}</p>)}
                    </div>

                    <div className="form-group">
                        <input type="text" name="description" placeholder="Enter Banner description here" value={formik.values.description} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                        {formik.touched.description && formik.errors.description && (<p>{formik.errors.description}</p>)}
                    </div>

                    <div className="form-group">
                        <label>Images</label>
                        <input type = "file" placeholder="upload banner images here" name="images" accept="image/*" multiple                       onChange={(e)=>{
                            const selectedImages = Array.from(
                                e.currentTarget.files || []
                            )    
                            formik.setFieldValue("images",selectedImages)    
                        }}
                        />
                         {formik.touched.images && formik.errors.images && (<p>{formik.errors.images}</p>)}

                    </div>

                    <button type="submit" disabled={isLoading}>{isLoading ? "AddingBanner.." : "Add Banner"}</button>


                </form>
            </div>

        </>
    )
}

export default AddBanner;