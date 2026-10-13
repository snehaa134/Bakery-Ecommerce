
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetBannerQuery, useUpdateBannerMutation } from "../../servicesApis/bannerServices/bannerServices";
const UpdateBanner = () => {
    const { id } = useParams();
    const { data, isLoading: isFetching } = useGetBannerQuery(id);
    const [updateBanner, { isLoading }] = useUpdateBannerMutation();

    const banner = data?.data;
    const navigate = useNavigate();

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            title: banner?.title || "",
            description: banner?.description || "",
            images: []
        },
        validationSchema: Yup.object({
            title: Yup.string().required("banner is required"),
            description: Yup.string().required("description is required"),
            images: Yup.array().max(6, "maximum 6 images are allowed")
        }),
        onSubmit: async (values) => {

            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("description", values.description);
            values.images.forEach((image) => {
                formData.append("images", image)
            })


            try {
                const response = await updateBanner({ id, formData }).unwrap();
                console.log("response", response);
                toast.success(response?.message || "banner updated successfully");
                formik.resetForm();
                navigate("/manage-banners")

            } catch (error) {
                console.log(error);
                toast.error(error?.data?.message || "failed to update-banner")
            }

        }
    })

    if (isFetching) {
        return <p>Loading Banner..</p>
    }
    if(!banner){
        return <p>Banner not found</p>
    }


    return (
        <>
            <div className="main-category">
                <h2>Update Banner</h2>

                <form onSubmit={formik.handleSubmit}>
                    <div className="form-group">
                        <label>Banner title:</label>
                        <input type="text" name="title" placeholder="Enter Banner title" value={formik.values.title} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                        {formik.touched.title && formik.errors.title && (<p>{formik.errors.title}</p>)}
                    </div>

                    <div className="form-group">
                        <label>Banner Description:</label>
                        <input type="text" name="description" placeholder="Enter description here" value={formik.values.description} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                        {formik.touched.description && formik.errors.description && (<p>{formik.errors.description}</p>)}
                    </div>

                    <div className="form-group">

                        <label>Current Baaner images:</label>
                        <div className="images">
                            {banner?.images?.map((image, index) => (

                                <img key={index} src={`http://localhost:5000/uploads/${image}`} alt={`Banner ${index + 1}`} width="100" />
                            ))}

                        </div>
                    </div>

                    <div className="form-group">
                        <label>Select New Images:(optional)</label>
                        <input type="file" name="images" accept="image/*" multiple onChange={(e) => {
                            const selectedImages = Array.from(
                                e.currentTarget.files || []
                            )

                            formik.setFieldValue("images", selectedImages);
                        }}
                            onBlur={() => formik.setFieldTouched("images", true)}
                        />

                        {formik.values.images.length > 0 && (
                            <p>
                                {formik.values.images.length}images selected
                            </p>
                        )}
                        {formik.touched.images && formik.errors.images && (<p>{formik.errors.images}</p>)}

                    </div>

                    <button type="submit" disabled={isLoading}>{isLoading ? "UpdatingBanner.." : "Update Banner"}</button>


                </form>
            </div>

        </>
    )
}

export default UpdateBanner;