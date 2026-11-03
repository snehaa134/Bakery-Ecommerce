
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAddFestiveThemeMutation } from "../../servicesApis/festiveThemeServices/festiveThemeService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../addFestiveTheme/addFestiveTheme.css";

const AddFestiveTheme = () => {
    const navigate = useNavigate();
    const [showPreview, setShowPreview] = useState(false);

    const [addFestiveTheme, { isLoading }] =
        useAddFestiveThemeMutation();

    const formik = useFormik({
        initialValues: {
            festivalName: "",
            primaryColor: "#E91E63",
            secondaryColor: "#FFF0F5",
            festivalDate: "",
            endDate: "",
            activationMode: "automatic",
            isEnabled: true,
            priority: 1,
            activateBeforeDays: 10,
            expiryAfterDays: 2,
            animationType: "none"
        },

        validationSchema: Yup.object({
            festivalName: Yup.string()
                .trim()
                .required("Festival name is required"),

            primaryColor: Yup.string()
                .matches(/^#[0-9A-Fa-f]{6}$/, "Enter a valid hex color")
                .required("Primary color is required"),

            secondaryColor: Yup.string()
                .matches(/^#[0-9A-Fa-f]{6}$/, "Enter a valid hex color")
                .required("Secondary color is required"),

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
                .min(1, "Minimum priority is 1")
                .required("Priority is required"),

            activateBeforeDays: Yup.number()
                .min(0, "Value cannot be negative")
                .required("Activation days are required"),

            expiryAfterDays: Yup.number()
                .min(0, "Value cannot be negative")
                .required("Expiry days are required"),

            animationType: Yup.string()
                .oneOf([
                    "none",
                    "diya-glow",
                    "sparkle",
                    "fade",
                    "snowfall",
                    "twinkle",
                    "slide",
                    "confetti",
                    "gold-glow",
                    "zoom"
                ])
                .required("Animation type is required")
        }),

        onSubmit: async (values, { resetForm }) => {
            try {
                const slug = values.festivalName
                    .toLowerCase()
                    .trim()
                    .replace(/\s+/g, "-");

                const payload = {
                    ...values,
                    slug,
                    isManuallyActive: false
                };

                if (values.activationMode === "automatic") {
                    delete payload.festivalDate;
                    delete payload.endDate;
                }

                const response = await addFestiveTheme(payload).unwrap();

                toast.success(
                    response.message || "Festive theme added successfully"
                );

                resetForm();
                navigate("/manage-festive-themes");

            } catch (error) {
                toast.error(
                    error?.data?.message || "Unable to add festive theme"
                );
            }
        }
    });

    const handleColorChange = (e) => {
        const { name, value } = e.target;
        formik.setFieldValue(name, value);
    };

    const festivalSlug = formik.values.festivalName
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-");

    return (
        <div className="add-festive-page">

            <div className="festive-heading">
                <div>
                    <h2>Create Festive Theme</h2>
                    <p>
                        Customize your Bakery Bliss website for festivals
                    </p>
                </div>

                <button
                    type="button"
                    className="festive-back-btn"
                    onClick={() => navigate("/manage-festive-themes")}
                >
                    Back to Themes
                </button>
            </div>

            <form
                onSubmit={formik.handleSubmit}
                className="festive-form"
            >

                <div className="festive-form-section">
                    <h3>Festival Information</h3>

                    <div className="festive-form-grid">

                        <div className="festive-field">
                            <label>Festival Name</label>

                            <input
                                type="text"
                                name="festivalName"
                                placeholder="e.g. Diwali"
                                value={formik.values.festivalName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />

                            {formik.touched.festivalName &&
                                formik.errors.festivalName && (
                                    <small>
                                        {formik.errors.festivalName}
                                    </small>
                                )}
                        </div>

                        <div className="festive-field">
                            <label>Slug</label>

                            <input
                                type="text"
                                value={festivalSlug}
                                placeholder="diwali"
                                readOnly
                            />

                            <small>
                                Automatically generated from festival name
                            </small>
                        </div>

                        {formik.values.activationMode === "manual" && (
                            <>
                                <div className="festive-field">
                                    <label>Festival Date</label>

                                    <input
                                        type="date"
                                        name="festivalDate"
                                        value={formik.values.festivalDate}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />

                                    {formik.touched.festivalDate &&
                                        formik.errors.festivalDate && (
                                            <small>
                                                {formik.errors.festivalDate}
                                            </small>
                                        )}
                                </div>

                                <div className="festive-field">
                                    <label>End Date</label>

                                    <input
                                        type="date"
                                        name="endDate"
                                        min={formik.values.festivalDate || undefined}
                                        value={formik.values.endDate}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />

                                    {formik.touched.endDate &&
                                        formik.errors.endDate && (
                                            <small>
                                                {formik.errors.endDate}
                                            </small>
                                        )}
                                </div>
                            </>
                        )}

                        {formik.values.activationMode === "automatic" && (
                            <div className="festive-field">
                                <label>Festival Dates</label>

                                <small>
                                    Festival dates will be fetched automatically
                                    from Google Calendar.
                                </small>
                            </div>
                        )}

                    </div>
                </div>

                <div className="festive-form-section">
                    <h3>Theme Colors</h3>

                    <div className="festive-form-grid">

                        <div className="festive-field">
                            <label>Primary Color</label>

                            <div className="festive-color-input">
                                <input
                                    type="color"
                                    name="primaryColor"
                                    value={formik.values.primaryColor}
                                    onChange={handleColorChange}
                                />

                                <span>
                                    {formik.values.primaryColor}
                                </span>
                            </div>

                            {formik.touched.primaryColor &&
                                formik.errors.primaryColor && (
                                    <small>
                                        {formik.errors.primaryColor}
                                    </small>
                                )}
                        </div>

                        <div className="festive-field">
                            <label>Secondary Color</label>

                            <div className="festive-color-input">
                                <input
                                    type="color"
                                    name="secondaryColor"
                                    value={formik.values.secondaryColor}
                                    onChange={handleColorChange}
                                />

                                <span>
                                    {formik.values.secondaryColor}
                                </span>
                            </div>

                            {formik.touched.secondaryColor &&
                                formik.errors.secondaryColor && (
                                    <small>
                                        {formik.errors.secondaryColor}
                                    </small>
                                )}
                        </div>

                    </div>
                </div>

                <div className="festive-form-section">
                    <h3>Activation Settings</h3>

                    <div className="festive-form-grid">

                        <div className="festive-field">
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

                        <div className="festive-field">
                            <label>Theme Status</label>

                            <select
                                name="isEnabled"
                                value={String(formik.values.isEnabled)}
                                onChange={(e) => {
                                    formik.setFieldValue(
                                        "isEnabled",
                                        e.target.value === "true"
                                    );
                                }}
                            >
                                <option value="true">Enabled</option>
                                <option value="false">Disabled</option>
                            </select>
                        </div>

                        <div className="festive-field">
                            <label>Activate Before Days</label>

                            <input
                                type="number"
                                min="0"
                                name="activateBeforeDays"
                                value={formik.values.activateBeforeDays}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />

                            {formik.touched.activateBeforeDays &&
                                formik.errors.activateBeforeDays && (
                                    <small>
                                        {formik.errors.activateBeforeDays}
                                    </small>
                                )}
                        </div>

                        <div className="festive-field">
                            <label>Expiry After Days</label>

                            <input
                                type="number"
                                min="0"
                                name="expiryAfterDays"
                                value={formik.values.expiryAfterDays}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />

                            {formik.touched.expiryAfterDays &&
                                formik.errors.expiryAfterDays && (
                                    <small>
                                        {formik.errors.expiryAfterDays}
                                    </small>
                                )}
                        </div>

                        <div className="festive-field">
                            <label>Priority</label>

                            <input
                                type="number"
                                min="1"
                                name="priority"
                                value={formik.values.priority}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />

                            {formik.touched.priority &&
                                formik.errors.priority && (
                                    <small>
                                        {formik.errors.priority}
                                    </small>
                                )}
                        </div>

                        <div className="festive-field">
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

                            {formik.touched.animationType &&
                                formik.errors.animationType && (
                                    <small>
                                        {formik.errors.animationType}
                                    </small>
                                )}
                        </div>

                    </div>
                </div>

                <div className="festive-preview">
                    <h3>Theme Color Preview</h3>

                    <div
                        className="festive-preview-card"
                        style={{
                            backgroundColor: formik.values.secondaryColor,
                            borderColor: formik.values.primaryColor
                        }}
                    >
                        <h3
                            style={{
                                color: formik.values.primaryColor
                            }}
                        >
                            {formik.values.festivalName || "Your Festival"}
                        </h3>

                        <button
                            type="button"
                            style={{
                                backgroundColor: formik.values.primaryColor
                            }}
                            onClick={() => setShowPreview(true)}
                        >
                           Preview Theam
                        </button>
                    </div>
                </div>

                <div className="festive-submit-area">

                    <button
                        type="button"
                        className="festive-cancel-btn"
                        onClick={() => navigate("/manage-festive-themes")}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="festive-submit-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? "Creating..." : "Create Festive Theme"}
                    </button>

                </div>

            </form>

            {showPreview && (
                <div
                    className="festive-preview-overlay"
                    onClick={() => setShowPreview(false)}
                >
                    <div
                        className="festive-preview-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="festive-preview-close"
                            onClick={() => setShowPreview(false)}
                            aria-label="Close preview"
                        >
                            &times;
                        </button>

                        <p className="festive-preview-label">
                            BAKERY BLISS FESTIVE PREVIEW
                        </p>

                        <div
                            className="festive-preview-live"
                            style={{
                                backgroundColor: formik.values.secondaryColor,
                                borderColor: formik.values.primaryColor
                            }}
                        >
                            <span
                                className="festive-preview-dot"
                                style={{
                                    backgroundColor: formik.values.primaryColor
                                }}
                            />

                            <h2 style={{ color: formik.values.primaryColor }}>
                                {formik.values.festivalName || "Your Festival"}
                            </h2>

                            <p style={{ color: formik.values.primaryColor }}>
                                Celebrate the season with Bakery Bliss
                            </p>

                            {/* <button
                                type="button"
                                style={{
                                    backgroundColor: formik.values.primaryColor
                                }}
                            >
                                Explore Collection
                            </button> */}
                        </div>

                        <div className="festive-preview-swatch-row">
                            <div>
                                <span
                                    style={{
                                        backgroundColor: formik.values.primaryColor
                                    }}
                                />

                                <small>Primary</small>
                                <strong>{formik.values.primaryColor}</strong>
                            </div>

                            <div>
                                <span
                                    style={{
                                        backgroundColor: formik.values.secondaryColor
                                    }}
                                />

                                <small>Secondary</small>
                                <strong>{formik.values.secondaryColor}</strong>
                            </div>
                        </div>

                        <p className="festive-preview-animation">
                            Animation: <strong>{formik.values.animationType}</strong>
                        </p>

                        <p className="festive-preview-note">
                            This is only a preview. Your theme will be saved
                            when you click Create Festive Theme.
                        </p>

                        <button
                            type="button"
                            className="festive-preview-done"
                            onClick={() => setShowPreview(false)}
                        >
                            Back to Form
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AddFestiveTheme;
