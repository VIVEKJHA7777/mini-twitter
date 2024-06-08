import express from 'express';
const app= express();
import authRoutes from './routes/auth.routes.js'

app.use("/api/auth",authRoutes);

app.listen(8000,()=>{
    console.log("server is running on this port")
})