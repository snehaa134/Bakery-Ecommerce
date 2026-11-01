const FestiveTheme = require("../models/FestiveTheme");
const STATUS_CODE = require("../helpers/enum");

const addFestiveTheme = async (req, res) => {
    try {
        const {
            festivalName,
            primaryColor,
            secondaryColor,
            festivalDate,
            endDate,
            activationMode,
            isManuallyActive,
            isEnabled,
            priority,
            activateBeforeDays,
            expiryAfterDays,
            animationType
        } = req.body;

        const slug = (req.body.slug || festivalName).toLowerCase().trim().replace(/\s+/g, "-");


        const theme = await FestiveTheme.create({
            festivalName,
            primaryColor,
            secondaryColor,
            slug,
            festivalDate,
            endDate,
            activationMode,
            isManuallyActive,
            isEnabled,
            priority,
            activateBeforeDays,
            expiryAfterDays,
            animationType
        })
        return res.status(STATUS_CODE.CREATED).json({
            message: "Festive theme created successfully",
            data: theme
        })
    } catch (error) {
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            message: error.message
        });
    }
}

const getAllFestiveThemes = async (req, res) => {
    try {

        const themes = await FestiveTheme.find({})
            .sort({ priority: -1, festivalDate: 1 });

        return res.status(STATUS_CODE.OK).json({
            success: true,
            message: "All festive themes fetched successfully",
            data: themes
        });

    } catch (error) {
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        });
    }
};


const getFestiveThemeById = async (req, res) => {
    try {
        const { id } = req.params;
        const theme = await FestiveTheme.findById(id);
        if (!theme) {
            return res.status(STATUS_CODE.NOT_FOUND).json({
                success: false,
                message: "Theme not found"
            })
        }

        return res.status(STATUS_CODE.OK).json({
            success: true,
            message: "Festive Theme fetched successfully",
            data: theme
        });
    } catch (error) {
        console.log("Get Festive Theme By Id Error:", error);

        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        });
    }
}

const setManualThemeStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isManuallyActive } = req.body;

        const theme = await FestiveTheme.findById(id);
        if (!theme) {
            return res.status(STATUS_CODE.NOT_FOUND).json({
                message: "Theme not found"
            })
        }

        if (theme.activationMode !== "manual") {
            return res.status(STATUS_CODE.BAD_REQUEST).json({
                message: "Theme is not in a manual mode"
            })
        }
        if (typeof isManuallyActive !== "boolean") {
            return res.status(STATUS_CODE.BAD_REQUEST).json({
                message: "send please true or false"
            })
        }

        theme.isManuallyActive = isManuallyActive;
        await theme.save()
        return res.status(STATUS_CODE.OK).json({
            message: "manual theme set successfully",
            data: theme
        })


    } catch (error) {
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            message: error.message
        });
    }
}


const updateFestiveTheme = async (req, res) => {
    try {
        const { festivalName,
            slug,
            primaryColor,
            secondaryColor,
            festivalDate,
            endDate,
            activationMode,
            isEnabled,
            priority,
            activateBeforeDays,
            expiryAfterDays,
            animationType } = req.body;

        const theme = await FestiveTheme.findById(req.params.id);
        if (!theme) {
            return res.status(STATUS_CODE.NOT_FOUND).json({
                message: "Festive Theme not found"
            })
        }

        const updateData = {};

        if (festivalName !== undefined) {
            updateData.festivalName = festivalName
        }

        if (slug !== undefined) {
            updateData.slug = slug.toLowerCase().trim().replace(/\s+/g, "-");
        }



        if (primaryColor !== undefined) {
            updateData.primaryColor = primaryColor
        }

        if (secondaryColor !== undefined) {
            updateData.secondaryColor = secondaryColor
        }
        if (festivalDate !== undefined) {
            updateData.festivalDate = festivalDate;
        }

        if (endDate !== undefined) {
            updateData.endDate = endDate;
        }

        if (activationMode !== undefined) {
            updateData.activationMode = activationMode;
        }


        if (isEnabled !== undefined) {
            updateData.isEnabled =
                isEnabled === true || isEnabled === "true";
        }

        if (priority !== undefined) {
            updateData.priority = Number(priority);
        }

        if (activateBeforeDays !== undefined) {
            updateData.activateBeforeDays = Number(activateBeforeDays);
        }

        if (expiryAfterDays !== undefined) {
            updateData.expiryAfterDays = Number(expiryAfterDays);
        }

        if (animationType !== undefined) {
            updateData.animationType = animationType;
        }


        const updatedTheme = await FestiveTheme.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                returnDocument: "after",
                runValidators: true
            }
        );
        return res.status(STATUS_CODE.OK).json({
            message: "Festive theme updated successfully",
            data: updatedTheme
        });


    } catch (error) {
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            message: error.message
        });
    }
}

const deleteFestiveTheme = async (req, res) => {
    try {
        const { id } = req.params;
        const theme = await FestiveTheme.findByIdAndDelete(id);
        if (!theme) {
            return res.status(STATUS_CODE.NOT_FOUND).json({
                message: "Festive theme not found"
            });

        }
        return res.status(STATUS_CODE.OK).json({
            message: "Festive theme deleted successfully",
            data: theme
        });

    } catch (error) {
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            message: error.message
        });
    }
}


const getActiveFestiveTheme = async (req, res) => {
    try {
        const themes = await FestiveTheme.find({
            isEnabled: true
        })

        const currentDate = new Date();

        const activeThemes = themes.filter((theme) => {

            if (theme.activationMode === "manual") {
                return theme.isManuallyActive === true;
            }

            if (theme.activationMode === "automatic") {

                const activationDate = new Date(theme.festivalDate);
                activationDate.setDate(
                    activationDate.getDate() - theme.activateBeforeDays
                )
                activationDate.setHours(0, 0, 0, 0);

                const expiryDate = new Date(theme.endDate);
                expiryDate.setDate(
                    expiryDate.getDate() + theme.expiryAfterDays
                )
                expiryDate.setHours(23, 59, 59, 999)

                return (
                    currentDate >= activationDate && currentDate <= expiryDate
                )
            }
            return false
        })

        activeThemes.sort((a, b) => b.priority - a.priority);

        const activeTheme = activeThemes[0] || null;

        return res.status(STATUS_CODE.OK).json({
            message: activeTheme ? "Active Festive Theme Fetched Successfully" : "No festive theme is currently active",
            data: activeTheme
        })

    } catch (error) {
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            message: error.message
        });
    }
}

module.exports = { addFestiveTheme, getAllFestiveThemes, getFestiveThemeById, setManualThemeStatus, updateFestiveTheme, deleteFestiveTheme, getActiveFestiveTheme }


