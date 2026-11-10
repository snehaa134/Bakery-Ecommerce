const FestiveTheme = require("../models/FestiveTheme");
const STATUS_CODE = require("../helpers/enum");

const {
    calendar,
    calendarId
} = require("../config/googleCalender");


const getFestivalDatesFromCalendar = async (festivalName) => {
    const currentYear = new Date().getFullYear();

    const response = await calendar.events.list({
        calendarId,
        timeMin: new Date(`${currentYear}-01-01T00:00:00Z`).toISOString(),
        timeMax: new Date(`${currentYear + 2}-01-01T00:00:00Z`).toISOString(),
        q: festivalName,
        singleEvents: true,
        orderBy: "startTime"
    });


    const events = response.data.items || [];

    const matchingEvent = events.find((event) =>
        event.summary?.toLowerCase().includes(festivalName.toLowerCase())
    );

    if (!matchingEvent) {
        throw new Error(`${festivalName} not found in Google Calendar`);
    }


    const startDate = matchingEvent.start.date || matchingEvent.start.dateTime;
    const endDate = matchingEvent.end.date || matchingEvent.end.dateTime;



    let actualEndDate = endDate;

    if (matchingEvent.end.date) {
        const date = new Date(`${endDate}T00:00:00Z`);

        date.setUTCDate(date.getUTCDate() - 1);

        actualEndDate = date.toISOString().split("T")[0];
    }

    return {
        festivalDate: startDate.split("T")[0],
        endDate: actualEndDate.split("T")[0]
    };
};


const addFestiveTheme = async (req, res) => {
    try {
        const {
            festivalName,
            primaryColor,
            secondaryColor,
            activationMode,
            isManuallyActive,
            isEnabled,
            priority,
            activateBeforeDays,
            expiryAfterDays,
            animationType
        } = req.body;

        const slug = (req.body.slug || festivalName)
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-");

        let festivalDate = req.body.festivalDate;
        let endDate = req.body.endDate;


        if (activationMode === "automatic") {
            const dates = await getFestivalDatesFromCalendar(festivalName);

            festivalDate = dates.festivalDate;
            endDate = dates.endDate;
        }

        if (activationMode === "manual" && (!festivalDate || !endDate)) {
            return res.status(STATUS_CODE.BAD_REQUEST).json({
                message: "Festival date and end date are required in manual mode"
            });
        }

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
        });

        return res.status(STATUS_CODE.CREATED).json({
            message: "Festive theme created successfully",
            data: theme
        });

    } catch (error) {
        console.log("ADD FESTIVE THEME ERROR:", error);

        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            message: error.message
        });
    }
};



const getAllFestiveThemes = async (req, res) => {
    try {
        const themes = await FestiveTheme.find()
            .sort({ priority: -1 });

        return res.status(STATUS_CODE.OK).json({
            message: "Festive themes fetched successfully",
            data: themes
        });

    } catch (error) {
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            message: error.message
        });
    }
};

const getFestiveThemeById = async (req, res) => {
    try {
        const theme = await FestiveTheme.findById(req.params.id);

        if (!theme) {
            return res.status(STATUS_CODE.NOT_FOUND).json({
                message: "Festive theme not found"
            });
        }

        return res.status(STATUS_CODE.OK).json({
            message: "Festive theme fetched successfully",
            data: theme
        });

    } catch (error) {
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            message: error.message
        });
    }
};



const setManualThemeStatus = async (req, res) => {
    try {
        const { isManuallyActive } = req.body;

        const theme = await FestiveTheme.findById(req.params.id);

        if (!theme) {
            return res.status(STATUS_CODE.NOT_FOUND).json({
                message: "Festive theme not found"
            });
        }

        if (theme.activationMode !== "manual") {
            return res.status(STATUS_CODE.BAD_REQUEST).json({
                message: "Only manual themes can be activated or deactivated manually"
            });
        }

        theme.isManuallyActive = isManuallyActive;

        await theme.save();

        return res.status(STATUS_CODE.OK).json({
            message: "Manual theme status updated successfully",
            data: theme
        });

    } catch (error) {
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            message: error.message
        });
    }
};



const updateFestiveTheme = async (req, res) => {
    try {
        const theme = await FestiveTheme.findById(req.params.id);

        if (!theme) {
            return res.status(STATUS_CODE.NOT_FOUND).json({
                message: "Festive theme not found"
            });
        }

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

        const updateData = {};

        const finalFestivalName = festivalName || theme.festivalName;

        const finalActivationMode = activationMode || theme.activationMode;


        const shouldRefreshDates =
            finalActivationMode === "automatic" &&
            (
                theme.activationMode !== "automatic" ||
                finalFestivalName !== theme.festivalName
            );

        if (shouldRefreshDates) {
            const dates = await getFestivalDatesFromCalendar(finalFestivalName);

            updateData.festivalDate = dates.festivalDate;
            updateData.endDate = dates.endDate;
        }

        if (festivalName !== undefined) {
            updateData.festivalName = festivalName;
        }

        if (primaryColor !== undefined) {
            updateData.primaryColor = primaryColor;
        }

        if (secondaryColor !== undefined) {
            updateData.secondaryColor = secondaryColor;
        }

        if (activationMode !== undefined) {
            updateData.activationMode = activationMode;
        }

        if (isManuallyActive !== undefined) {
            updateData.isManuallyActive = isManuallyActive;
        }

        if (isEnabled !== undefined) {
            updateData.isEnabled = isEnabled;
        }

        if (priority !== undefined) {
            updateData.priority = priority;
        }

        if (activateBeforeDays !== undefined) {
            updateData.activateBeforeDays = activateBeforeDays;
        }

        if (expiryAfterDays !== undefined) {
            updateData.expiryAfterDays = expiryAfterDays;
        }

        if (animationType !== undefined) {
            updateData.animationType = animationType;
        }

        if (finalActivationMode === "manual") {
            if (festivalDate !== undefined) {
                updateData.festivalDate = festivalDate;
            }

            if (endDate !== undefined) {
                updateData.endDate = endDate;
            }

            if (!updateData.festivalDate && !theme.festivalDate) {
                return res.status(STATUS_CODE.BAD_REQUEST).json({
                    message: "Festival date is required in manual mode"
                });
            }

            if (!updateData.endDate && !theme.endDate) {
                return res.status(STATUS_CODE.BAD_REQUEST).json({
                    message: "End date is required in manual mode"
                });
            }
        }

        const updatedTheme = await FestiveTheme.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            {
                new: true,
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
};



const deleteFestiveTheme = async (req, res) => {
    try {
        const theme = await FestiveTheme.findByIdAndDelete(req.params.id);

        if (!theme) {
            return res.status(STATUS_CODE.NOT_FOUND).json({
                message: "Festive theme not found"
            });
        }

        return res.status(STATUS_CODE.OK).json({
            message: "Festive theme deleted successfully"
        });

    } catch (error) {
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            message: error.message
        });
    }
};


const getActiveFestiveTheme = async (req, res) => {
    try {
        const currentDate = new Date();

        const themes = await FestiveTheme.find({
            isEnabled: true
        }).sort({
            priority: -1
        });

        const activeThemes = themes.filter((theme) => {


            if (theme.activationMode === "manual") {
                return theme.isManuallyActive === true;
            }


            const activationDate = new Date(theme.festivalDate);

            activationDate.setDate(
                activationDate.getDate() - theme.activateBeforeDays
            );

            const expiryDate = new Date(theme.endDate);

            expiryDate.setDate(
                expiryDate.getDate() + theme.expiryAfterDays
            );

            expiryDate.setHours(23, 59, 59, 999);
            return (
                theme.activationMode === "automatic" &&
                currentDate >= activationDate &&
                currentDate <= expiryDate
            );
        });

        const activeTheme = activeThemes[0] || null;

        return res.status(STATUS_CODE.OK).json({
            message: "Active festive theme fetched successfully",
            data: activeTheme
        });

    } catch (error) {
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            message: error.message
        });
    }
};




module.exports = {
    addFestiveTheme,
    getAllFestiveThemes,
    getFestiveThemeById,
    setManualThemeStatus,
    updateFestiveTheme,
    deleteFestiveTheme,
    getActiveFestiveTheme
};