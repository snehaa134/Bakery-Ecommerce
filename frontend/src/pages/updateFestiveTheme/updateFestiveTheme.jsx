
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { useGetFestiveThemeByIdQuery, useUpdateFestiveThemeMutation } from "../../servicesApis/festiveThemeServices/festiveThemeService";
import "../updateFestiveTheme/updateFestiveTheme.css";

const EditFestiveTheme = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const {
        data,
        isLoading,
        isError
    } = useGetFestiveThemeByIdQuery(id);

    const [
        updateFestiveTheme,
        { isLoading: isUpdating }
    ] = useUpdateFestiveThemeMutation();

    const theme = data?.data;

    const formik = useFormik({
        enableReinitialize: true,

        initialValues: {
            festivalName: theme?.festivalName || "",
            primaryColor: theme?.primaryColor || "#ffffff",
            secondaryColor: theme?.secondaryColor || "#ffffff",
            festivalDate: theme?.festivalDate
                ? new Date(theme.festivalDate).toISOString().split("T")[0]
                : "",
            endDate: theme?.endDate
                ? new Date(theme.endDate).toISOString().split("T")[0]
                : "",
            activationMode: theme?.activationMode || "automatic",
            isEnabled: theme?.isEnabled ?? true,
            priority: theme?.priority ?? 1,
            activateBeforeDays: theme?.activateBeforeDays ?? 10,
            expiryAfterDays: theme?.expiryAfterDays ?? 2,
            animationType: theme?.animationType || "none"
        },

        validationSchema: Yup.object({
            festivalName: Yup.string()
                .required("Festival name is required"),

            primaryColor: Yup.string()
                .matches(/^#[0-9A-Fa-f]{6}$/, "Enter a valid color")
                .required("Primary color is required"),

            secondaryColor: Yup.string()
                .matches(/^#[0-9A-Fa-f]{6}$/, "Enter a valid color")
                .required("Secondary color is required"),

            // Dates required only in manual mode
            festivalDate: Yup.date().when("activationMode", {
                is: "manual",
                then: (schema) =>
                    schema.required("Festival date is required"),
                otherwise: (schema) => schema.notRequired()
            }),

            endDate: Yup.date().when("activationMode", {
                is: "manual",
                then: (schema) =>
                    schema
                        .required("End date is required")
                        .min(
                            Yup.ref("festivalDate"),
                            "End date cannot be before festival date"
                        ),
                otherwise: (schema) => schema.notRequired()
            }),

            activationMode: Yup.string()
                .oneOf(["automatic", "manual"])
                .required("Activation mode is required"),

            priority: Yup.number()
                .min(1, "Priority must be at least 1")
                .required("Priority is required"),

            activateBeforeDays: Yup.number()
                .min(0, "Value cannot be negative")
                .required("Activation days are required"),

            expiryAfterDays: Yup.number()
                .min(0, "Value cannot be negative")
                .required("Expiry days are required"),

            animationType: Yup.string()
                .required("Animation type is required")
        }),

        onSubmit: async (values) => {
            try {
                const themeData = {
                    ...values,
                    slug: values.festivalName
                        .toLowerCase()
                        .trim()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/^-|-$/g, "")
                };

                // Automatic mode mein dates backend fetch karega
                if (values.activationMode === "automatic") {
                    delete themeData.festivalDate;
                    delete themeData.endDate;
                }

                const response = await updateFestiveTheme({
                    id,
                    themeData
                }).unwrap();

                toast.success(
                    response.message || "Festive theme updated successfully"
                );

                navigate("/manage-festive-themes");
            } catch (error) {
                toast.error(
                    error?.data?.message || "Unable to update festive theme"
                );
            }
        }
    });

    if (isLoading) {
        return <p className="festive-loading">Loading theme details...</p>;
    }

    if (isError || !theme) {
        return (
            <p className="festive-error-message">
                Unable to load festive theme details.
            </p>
        );
    }

    return (
        <div className="add-festive-container">
            <div className="add-festive-header">
                <h2>Edit Festive Theme</h2>
                <p>Update your festival theme settings</p>
            </div>

            <form onSubmit={formik.handleSubmit} className="festive-form">

                <div className="form-group">
                    <label>Festival Name</label>
                    <input
                        type="text"
                        name="festivalName"
                        value={formik.values.festivalName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter festival name"
                    />
                    {formik.touched.festivalName && formik.errors.festivalName && (
                        <span className="error-text">{formik.errors.festivalName}</span>
                    )}
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Primary Color</label>
                        <input
                            type="color"
                            name="primaryColor"
                            value={formik.values.primaryColor}
                            onChange={formik.handleChange}
                        />
                        <span>{formik.values.primaryColor}</span>
                        {formik.touched.primaryColor && formik.errors.primaryColor && (
                            <span className="error-text">{formik.errors.primaryColor}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Secondary Color</label>
                        <input
                            type="color"
                            name="secondaryColor"
                            value={formik.values.secondaryColor}
                            onChange={formik.handleChange}
                        />
                        <span>{formik.values.secondaryColor}</span>
                        {formik.touched.secondaryColor && formik.errors.secondaryColor && (
                            <span className="error-text">{formik.errors.secondaryColor}</span>
                        )}
                    </div>
                </div>

                {/* Dates show only in manual mode */}
                {formik.values.activationMode === "manual" && (
                    <div className="form-row">
                        <div className="form-group">
                            <label>Festival Date</label>
                            <input
                                type="date"
                                name="festivalDate"
                                value={formik.values.festivalDate}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.festivalDate && formik.errors.festivalDate && (
                                <span className="error-text">{formik.errors.festivalDate}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label>End Date</label>
                            <input
                                type="date"
                                name="endDate"
                                min={formik.values.festivalDate || undefined}
                                value={formik.values.endDate}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.endDate && formik.errors.endDate && (
                                <span className="error-text">{formik.errors.endDate}</span>
                            )}
                        </div>
                    </div>
                )}

                {formik.values.activationMode === "automatic" && (
                    <div className="form-group">
                        <label>Festival Dates</label>
                        <small>
                            Festival dates will be fetched automatically from Google Calendar.
                        </small>
                    </div>
                )}

                <div className="form-group">
                    <label>Activation Mode</label>
                    <select
                        name="activationMode"
                        value={formik.values.activationMode}
                        onChange={(e) => {
                            formik.handleChange(e);

                            if (e.target.value === "automatic") {
                                formik.setFieldValue("festivalDate", "");
                                formik.setFieldValue("endDate", "");
                            }
                        }}
                    >
                        <option value="automatic">Automatic</option>
                        <option value="manual">Manual</option>
                    </select>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Priority</label>
                        <input
                            type="number"
                            name="priority"
                            min="1"
                            value={formik.values.priority}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.priority && formik.errors.priority && (
                            <span className="error-text">{formik.errors.priority}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Activate Before Days</label>
                        <input
                            type="number"
                            name="activateBeforeDays"
                            min="0"
                            value={formik.values.activateBeforeDays}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.activateBeforeDays && formik.errors.activateBeforeDays && (
                            <span className="error-text">{formik.errors.activateBeforeDays}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Expiry After Days</label>
                        <input
                            type="number"
                            name="expiryAfterDays"
                            min="0"
                            value={formik.values.expiryAfterDays}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.expiryAfterDays && formik.errors.expiryAfterDays && (
                            <span className="error-text">{formik.errors.expiryAfterDays}</span>
                        )}
                    </div>
                </div>

                <div className="form-group">
                    <label>Animation Type</label>
                    <select
                        name="animationType"
                        value={formik.values.animationType}
                        onChange={formik.handleChange}
                    >
                        <option value="none">None</option>
                        <option value="diya-glow">Diya Glow</option>
                        <option value="sparkle">Sparkle</option>
                        <option value="fade">Fade</option>
                        <option value="snowfall">Snowfall</option>
                        <option value="twinkle">Twinkle</option>
                        <option value="slide">Slide</option>
                        <option value="confetti">Confetti</option>
                        <option value="gold-glow">Gold Glow</option>
                        <option value="zoom">Zoom</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="festive-checkbox-label">
                        <input
                            type="checkbox"
                            name="isEnabled"
                            checked={formik.values.isEnabled}
                            onChange={formik.handleChange}
                        />
                        Enable this theme
                    </label>
                </div>

                <div className="festive-form-actions">
                    <button
                        type="submit"
                        disabled={isUpdating}
                    >
                        {isUpdating ? "Updating..." : "Update Theme"}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/admin/manage-festive-themes")}
                    >
                        Cancel
                    </button>
                </div>

            </form>
        </div>
    );
};

export default EditFestiveTheme;
