import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

import { pool } from "./src/config/db.js";

import { initSchema } from "./schema-init.js";
import { setIO } from "./src/socket.js";

import authRoutes from "./src/modules/auth/auth.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import providerRoutes from "./src/routes/provider.js";
import listingRoutes from "./src/routes/listing.js";
import slotRoutes from "./src/routes/slot.js";
import reservationRoutes from "./src/routes/reservation.js";
import customerRoutes from "./src/routes/customer.js";
import paymentsRoutes from "./src/routes/payments.routes.js";
import reviewRoutes from "./src/routes/review.routes.js";
import favoriteRoutes from "./src/routes/favorite.routes.js";
import messageRoutes from "./src/routes/message.routes.js";

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: true,
    credentials: true,
  },
});

setIO(io);

const onlineUsers = new Map();

io.on("connection", (socket) => {
  socket.on("join", (userId) => {
    socket.join(`user_${userId}`);

    onlineUsers.set(
      Number(userId),
      socket.id
    );

    io.emit(
      "user-online",
      Number(userId)
    );

    socket.emit(
      "user-online",
      Number(userId)
    );
  });

  socket.on("typing", (data) => {
    io.to(
      `user_${data.receiverId}`
    ).emit(
      "user-typing",
      {
        senderId: data.senderId,
      }
    );
  });

 socket.on("disconnect", async () => {
  let disconnectedUser = null;

  for (const [userId, socketId] of onlineUsers) {
    if (socketId === socket.id) {
      disconnectedUser = userId;
      break;
    }
  }

  if (disconnectedUser) {
    onlineUsers.delete(
      disconnectedUser
    );

    try {
      await pool.query(
        `
        UPDATE users
        SET last_seen = NOW()
        WHERE id = $1
        `,
        [disconnectedUser]
      );
    } catch (error) {
      console.error(
        "LAST SEEN ERROR:",
        error
      );
    }

    io.emit(
      "user-offline",
      disconnectedUser
    );
  }
});
});

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/provider", providerRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/messages", messageRoutes);

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
  });
});

app.get("/api/payments/status", (req, res) => {
  const live =
    process.env.NODE_ENV === "production" &&
    Boolean(
      process.env.PAYPAL_CLIENT_ID &&
      process.env.PAYPAL_CLIENT_SECRET
    );

  res.json({
    livePaymentsConfigured: live,
    environment:
      process.env.NODE_ENV ||
      "development",
  });
});

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "BookHub API",
  });
});

const PORT =
  process.env.APP_PORT || 5000;

if (process.env.NODE_ENV !== "test") {
  initSchema()
    .then(() => {
      server.listen(PORT, () => {
        console.log(
          `Backend running on port ${PORT}`
        );
      });
    })
    .catch((error) => {
      console.error(
        "Schema initialization failed:",
        error
      );

      process.exit(1);
    });
}

export default app;