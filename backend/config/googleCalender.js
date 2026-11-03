const { google } = require("googleapis");

const calendar = google.calendar({
    version: "v3",
    auth: process.env.GOOGLE_CALENDAR_API_KEY
})
const calendarId =
    "en-gb.indian#holiday@group.v.calendar.google.com";
module.exports = { calendar, calendarId } 