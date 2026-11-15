import express from "express";

import { auth } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

import {
  sendMessage,
  getConversation,
  getInbox,
  getUnreadMessagesCount,
  uploadMessageImage,
  deleteMessage,
  addReaction,
  getMessageReactions,
  editMessage,
} from "../controllers/message.controller.js";
const router = express.Router();

router.get(
  "/unread-count",
  auth,
  getUnreadMessagesCount
);

router.get(
  "/",
  auth,
  getInbox
);

router.get(
  "/conversation/:userId",
  auth,
  getConversation
);

router.post(
  "/upload",
  auth,
  upload.single("image"),
  uploadMessageImage
);

router.post(
  "/",
  auth,
  sendMessage
);

router.delete(
  "/:id",
  auth,
  deleteMessage
);
router.put(
  "/:id",
  auth,
  editMessage
);
router.post(
  "/:id/reaction",
  auth,
  addReaction
);
router.get(
  "/:id/reactions",
  auth,
  getMessageReactions
);
export default router;