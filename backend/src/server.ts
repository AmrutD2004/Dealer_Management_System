import express, { type Request, type Response } from "express";
import cors from 'cors'
import cookieParser from 'cookie-parser'

import { dbConnected } from "./db/db";
import unifiedLogin from "./routes/auth/login";
import platformUserRoute from "./routes/PlatformUser/platformUserRoute";
import tenantRoute from "./routes/Tenant/tenantRoutes";

const app = express();
const PORT = Number(process.env.PORT) || 8081;


app.use(express.json())
app.use(cookieParser())
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174']
app.use(cors({ origin: allowedOrigins, credentials: true }))

app.use('/api', platformUserRoute)
app.use('/api', tenantRoute)
app.use('/api', unifiedLogin)
dbConnected().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
})

