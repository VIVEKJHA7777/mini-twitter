import express from 'express';
import path from "path";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import { v2 as cloudinary } from "cloudinary"

import authRoutes from './routes/auth.route.js'
import userRoutes from './routes/user.route.js';
import postRoutes from './routes/post.route.js';
import notificationsRoutes from './routes/notification.route.js';

import connectMongoDB from './db/connectMongoDB.js';

dotenv.config();

// CONFIG CLOUDINARY ACCOUNT
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// Middlewares
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Authentication routes
app.use("/api/auth", authRoutes);

// User routes
app.use("/api/users", userRoutes);

// Post routes
app.use("/api/posts", postRoutes);

// Notifications routes
app.use("/api/notifications", notificationsRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "frontend", "dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectMongoDB();
});
