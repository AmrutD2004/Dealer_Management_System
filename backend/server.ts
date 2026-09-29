import express, { type Request, type Response } from "express";
import cors from 'cors'
import cookieParser from 'cookie-parser'
import platformuserRoutes from "./routes/PlatformUserRoutes/PlatformUserRoutes";
import { dbConnected } from "./db/db";
import tenantRoute from "./routes/PlatformUserRoutes/tenantRoutes";
const app = express();
const PORT = Number(process.env.PORT) || 8081;


app.use(express.json())
app.use(cookieParser())
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174']
app.use(cors({ origin: allowedOrigins, credentials: true }))

app.use('/api', platformuserRoutes)
app.use('/api', tenantRoute)
dbConnected().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
})

