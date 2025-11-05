import express from "express";
const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Hello from Vercel API!" });
});

app.listen(5000, () => console.log("Server running on port 5000"));

export default function handler(req, res) {
  res.status(200).json({ message: "Hello from Vercel Serverless Function!" });
}
