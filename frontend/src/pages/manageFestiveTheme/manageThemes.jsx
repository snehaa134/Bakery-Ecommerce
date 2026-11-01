
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useSetManualThemeStatusMutation, useDeleteFestiveThemeMutation, useUpdateFestiveThemeMutation, useGetAllFestiveThemesQuery } from "../../servicesApis/festiveThemeServices/festiveThemeService";
import "../manageFestiveTheme/manageFestiveTheme.css";

const ManageFestiveThemes = () => {
    const navigate = useNavigate();
    const { data, isLoading, isError } = useGetAllFestiveThemesQuery();
    const [updateFestiveTheme, { isLoading: isUpdatingTheme }] = useUpdateFestiveThemeMutation();

    const [setManualThemeStatus, { isLoading: isUpdating }] = useSetManualThemeStatusMutation();

    const [deleteFestiveTheme, { isLoading: isDeleting }] = useDeleteFestiveThemeMutation();

    const themes = data?.data || [];

    const handleManualToggle = async (theme) => {
        if (theme.activationMode !== "manual") {
            toast.error("Only manual themes can be toggled");
            return;
        }
        try {
            const response = await setManualThemeStatus({
                id: theme._id,
                isManuallyActive: !theme.isManuallyActive
            }).unwrap();
            toast.success(
                response.message || "Theme status updated successfully"
            );
        } catch (error) {
            toast.error(
                error?.data?.message || "Unable to update theme status"
            );
        }
    };

    const handleEnableToggle = async (theme) => {
        try {
            const response = await updateFestiveTheme({
                id: theme._id,
                themeData: {
                    isEnabled: !theme.isEnabled
                }
            }).unwrap();
            toast.success(
                response.message || "Theme status updated successfully"
            );
        } catch (error) {
            toast.error(
                error?.data?.message || "Unable to update theme status"
            );
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this festive theme?"
        );
        if (!confirmDelete) return;
        try {
            const response = await deleteFestiveTheme(id).unwrap();
            toast.success(
                response.message || "Festive theme deleted successfully"
            );
        } catch (error) {
            toast.error(
                error?.data?.message || "Unable to delete festive theme"
            );
        }
    };

    if (isLoading) {
        return (
            <div className="festive-loading">
                Loading festive themes...
            </div>
        );
    }

    if (isError) {
        return (
            <div className="festive-error-message">
                Unable to fetch festive themes.
            </div>
        );
    }

    return (
        <div className="manage-festive-container">


            <div className="manage-festive-header">

                <div>
                    <h2>Manage Festive Themes</h2>

                    <p>
                        Manage all your Bakery Bliss festival themes
                    </p>
                </div>

                <button
                    className="add-festive-btn"
                    onClick={() =>
                        navigate("/add-festive-theme")
                    }
                >
                    + Add New Theme
                </button>

            </div>

            <div className="festive-count-card">
                <h3>{themes.length}</h3>
                <p>Total Festive Themes</p>
            </div>

            <div className="festive-table-wrapper">

                <table className="festive-table">

                    <thead>
                        <tr>
                            <th>Festival</th>
                            <th>Dates</th>
                            <th>Colors</th>
                            <th>Activation</th>
                            <th>Theme Status</th>
                            <th>Manual Control</th>
                            <th>Animation</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>

                        {themes.length > 0 ? (

                            themes.map((theme) => (

                                <tr key={theme._id}>

                                    <td>
                                        <strong>
                                            {theme.festivalName}
                                        </strong>

                                        <small>
                                            {theme.slug}
                                        </small>
                                    </td>

                                    <td>
                                        <div className="festive-date-info">
                                            <span>
                                                Start: {
                                                    new Date(
                                                        theme.festivalDate
                                                    ).toLocaleDateString("en-IN")
                                                }
                                            </span>

                                            <span>
                                                End: {
                                                    new Date(
                                                        theme.endDate
                                                    ).toLocaleDateString("en-IN")
                                                }
                                            </span>
                                        </div>
                                    </td>

                                    <td>
                                        <div className="festive-color-preview">

                                            <span
                                                title="Primary Color"
                                                style={{
                                                    backgroundColor:
                                                        theme.primaryColor
                                                }}
                                            />

                                            <span
                                                title="Secondary Color"
                                                style={{
                                                    backgroundColor:
                                                        theme.secondaryColor
                                                }}
                                            />

                                        </div>
                                    </td>

                                    <td>
                                        <span
                                            className={`activation-badge ${theme.activationMode}`}
                                        >
                                            {theme.activationMode}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            type="button"
                                            disabled={isUpdatingTheme}
                                            className={`theme-status-btn ${theme.isEnabled ? "enabled" : "disabled"
                                                }`}
                                            onClick={() => handleEnableToggle(theme)}
                                        >
                                            {isUpdatingTheme
                                                ? "Updating..."
                                                : theme.isEnabled
                                                    ? "Enabled"
                                                    : "Disabled"}
                                        </button>
                                    </td>




                                    <td>
                                        {theme.activationMode === "manual" ? (
                                            <label className="festive-toggle">
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        theme.isManuallyActive
                                                    }
                                                    onChange={() =>
                                                        handleManualToggle(theme)
                                                    }
                                                />
                                                <span className="festive-slider" />
                                            </label>
                                        ) : (

                                            <span className="automatic-label">
                                                Auto Controlled
                                            </span>

                                        )}
                                    </td>

                                    <td>
                                        {theme.animationType || "none"}
                                    </td>

                                    <td>
                                        <div className="festive-actions">

                                            <button
                                                type="button"
                                                className="edit-theme-btn"
                                                disabled={isUpdating}
                                                onClick={() =>
                                                    navigate(
                                                        `/edit-festive-theme/${theme._id}`
                                                    )
                                                }
                                            >
                                                {isUpdating ? "updating" : "updated"}
                                            </button>

                                            <button
                                                type="button"
                                                className="delete-theme-btn"
                                                disabled={isDeleting}
                                                onClick={() =>
                                                    handleDelete(theme._id)
                                                }
                                            >
                                                {isDeleting ? "Deleting" : "Deleted"}
                                            </button>

                                        </div>
                                    </td>

                                </tr>

                            ))

                        ) : (

                            <tr>
                                <td
                                    colSpan="8"
                                    className="no-festive-data"
                                >
                                    No festive themes found.
                                    Please add a new theme.
                                </td>
                            </tr>

                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
};

export default ManageFestiveThemes;
