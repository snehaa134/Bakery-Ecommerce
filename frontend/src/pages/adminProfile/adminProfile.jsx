import { useContext, useState, useEffect } from "react";
import { useLogoutMutation } from "../../servicesApis/authServices/authServices";

import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../authContext/authContext";
import { toast } from "react-toastify";
import "../profile/profile.css";
import { useGetCurrentUserQuery, useUpdateProfileMutation } from "../../servicesApis/userServices/userServices";
const AdminProfile = () => {
    const [logout] = useLogoutMutation();
    const [updateProfile, { isLoading }] = useUpdateProfileMutation();

    const { data } = useGetCurrentUserQuery();

    const { setIsLoggedIn, setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const user = data?.data;

    const [name, setName] = useState("");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");

    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setPreview(
                user.profileImage
                    ? `http://localhost:5000/uploads/${user.profileImage}`
                    : ""
            );
        }
    }, [user]);


    
    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };


    const handleUpdate = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", name.trim());

        if (image) {
            formData.append("image", image);
        }

        try {
            const response = await updateProfile(formData).unwrap();

            setName(response.data.name || "");

            if (response.data.profileImage) {
                setPreview(
                    `http://localhost:5000/uploads/${response.data.profileImage}`
                );
            }

            setImage(null);

            toast.success("Profile updated successfully!");
            navigate("/");
        } catch (error) {
            console.log("Profile update error:", error);
            toast.error(error?.data?.message || "Profile update failed");
        }
    };

    const handleLogout = async () => {
        try {
            await logout().unwrap();
            setIsLoggedIn(false);
            setUser(null);
            navigate("/");
        } catch (error) {
            console.log("error", error);
            toast.error("Logout failed");
        }
    };

    return (
        <div className="profile-container">
            <form className="profile-card" onSubmit={handleUpdate}>
                <h2>My Profile</h2>

                <div className="profile-image-section">
                    {preview ? (
                        <img
                            src={preview}
                            alt="Profile"
                            className="profile-image"
                        />
                    ) : (
                        <div className="profile-placeholder">
                            {name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                    )}

                    <label htmlFor="profile-image" className="upload-label">
                        Change Photo
                    </label>

                    <input
                        type="file"
                        id="profile-image"
                        accept="image/*"
                        onChange={handleImageChange}
                        hidden
                    />
                </div>

                <div className="profile-field">
                    <label>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="profile-field">
                    <label>Email</label>
                    <input
                        type="email"
                        value={user?.email || ""}
                        readOnly
                    />
                </div>

                <button
                    type="submit"
                    className="profile-update-btn"
                    disabled={isLoading}
                >
                    {isLoading ? "Updating..." : "Update Profile"}
                </button>

                <button
                    type="button"
                    className="profile-logout-btn"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </form>
        </div>
    );
};

export default AdminProfile;