import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());
// Routes Modules
app.use("/auth", require("./modules/auth/auth.routes"));
app.use("/users", require("./modules/users/user.routes"));
export default app;
