import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express();
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}))
app.use(express.json({ limit: '15kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"))
app.use(cookieParser());
import userRoutes from "./routes/user.routes.js"
import authRoutes from "./routes/auth.routes.js"
import productRoutes from "./routes/product.routes.js"

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/products", productRoutes);

export { app }