import express, { type Request, type Response } from "express";

const app = express();
const PORT = Number(process.env.PORT) || 8081;

app.get("/", (_request: Request, response: Response) => {
  response.json({ message: "Server is running" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
