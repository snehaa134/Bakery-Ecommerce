const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cookieParser = require("cookie-parser")
const connectDb = require("./config/db");
const userRouter = require("./routes/userRoutes");
const authRouter = require("./routes/authRoutes");
const adminAuthRouter= require("./routes/adminAuthRoutes");
const adminRouter = require("./routes/adminRoutes");
const categoryRouter= require("./routes/categoryRoutes");
const cors = require("cors");
const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(express.json());
app.use(cookieParser());

app.use("/", userRouter);
app.use("/", authRouter);
app.use("/",adminAuthRouter);
app.use("/",adminRouter);
app.use("/",categoryRouter);

connectDb();


const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`server running on PORT ${PORT}`)
})
