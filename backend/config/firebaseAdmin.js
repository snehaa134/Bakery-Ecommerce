const { initializeApp, cert } = require("firebase-admin/app");
const {getAuth} = require("firebase-admin/auth")

const admin = initializeApp({
    credential:cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL

    })
   
});

const auth = getAuth(admin);
module.exports = auth;