import express, { type Request, type Response } from "express";
import cors from 'cors'
import platformuserRoutes from "./routes/PlatformUserRoutes/PlatformUserRoutes";
import { dbConnected } from "./db/db";
const app = express();
const PORT = Number(process.env.PORT) || 8081;


app.use(express.json())
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174']
app.use(cors({ origin: allowedOrigins, credentials: true }))

app.use('/api', platformuserRoutes)
dbConnected().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
})

