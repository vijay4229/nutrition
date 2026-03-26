console.log("🚀 Server starting...");

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

console.log("🔑 API KEY:", process.env.API_KEY ? "Loaded ✅" : "Missing ❌");

const app = express();
app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Backend is working ✅");
});

app.listen(5000, () => {
  console.log("✅ Server running on http://localhost:5000");
});