import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5002;

// Connect Database
connectDB();

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Cloud Orchestrator API is running on port ${PORT}`);
});