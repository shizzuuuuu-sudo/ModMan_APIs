import express from "express";
import serverless from "serverless-http";

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Hello from Express on Vercel!" });
});

export default serverless(app);
