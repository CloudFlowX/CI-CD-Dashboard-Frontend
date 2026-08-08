import { Server } from "socket.io";
import logger from "./logger.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    logger.info(`Client connected to Socket.IO: ${socket.id}`);

    // Optionally join a room based on user id for targeted events
    socket.on("join", (userId) => {
      socket.join(userId);
      logger.info(`Socket ${socket.id} joined room ${userId}`);
    });

    socket.on("disconnect", () => {
      logger.info(`Client disconnected: ${socket.id}`);
    });
  });

  // Background task to emit live metrics and logs
  setInterval(() => {
    // Generate dummy CPU/RAM metrics
    const cpuUsage = Math.floor(Math.random() * 40) + 10;
    const memUsage = Math.floor(Math.random() * 60) + 20;
    io.emit("system_metrics", {
      cpuUsage: `${cpuUsage}%`,
      memoryUsage: `${memUsage}%`,
      timestamp: new Date().toISOString()
    });

    // Occasionally emit a log
    if (Math.random() > 0.5) {
      const services = ["Frontend Web", "E-commerce API", "User Service", "Payment Gateway"];
      const levels = ["INFO", "DEBUG", "WARN"];
      const messages = [
        "Request processed successfully in 42ms",
        "Connecting to database cluster...",
        "Cache miss for key user:1002",
        "Rate limit threshold approaching"
      ];
      io.emit("system_logs", {
        id: Date.now(),
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 23),
        level: levels[Math.floor(Math.random() * levels.length)],
        service: services[Math.floor(Math.random() * services.length)],
        message: messages[Math.floor(Math.random() * messages.length)],
        requestId: `req-${Math.floor(Math.random() * 9000) + 1000}`,
        traceId: `trace-${Math.random().toString(36).substring(7)}`,
        environment: "production-us-east",
        containerId: `cnt-${Math.random().toString(36).substring(7)}`
      });
    }
  }, 2000);

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
