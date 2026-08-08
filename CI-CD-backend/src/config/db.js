import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}`);

    // Connection event listeners
    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB Connection Error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB Disconnected. Attempting to reconnect...");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("✅ MongoDB Reconnected");
    });

    return conn;
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);

    if (error.message.includes("ENOTFOUND") || error.message.includes("failed to connect")) {
      console.error("💡 Tip: Check your internet connection and MongoDB Atlas whitelist settings");
    }

    if (error.message.includes("authentication failed") || error.message.includes("AuthenticationFailed")) {
      console.error("💡 Tip: Check your MongoDB username and password in MONGODB_URI");
    }

    throw error;
  }
};

export default connectDB;