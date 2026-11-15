import streamifier from "streamifier";

import cloudinary from "../config/cloudinary.js";
import { getIO } from "../socket.js";

import {
  sendMessageService,
  getConversationService,
  getInboxService,
  markConversationAsReadService,
  getUnreadMessagesCountService,
  deleteMessageService,
  addReactionService,
  getMessageReactionsService,
  editMessageService,
} from "../services/message.service.js";
export const sendMessage = async (
  req,
  res
) => {
  try {
    const message =
  await sendMessageService(
    req.user.id,
    req.body.receiver_id,
    req.body.message,
    req.body.image_url || null,
    req.body.reply_to || null
  );

    const io = getIO();

    io.to(
      `user_${req.body.receiver_id}`
    ).emit(
      "new-message",
      message
    );

    res.json(message);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const uploadMessageImage =
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: "File mancante",
        });
      }

      const uploadResult =
        await new Promise(
          (resolve, reject) => {
            const uploadStream =
              cloudinary.uploader.upload_stream(
                {
                  folder:
                    "booking-app/messages",
                  resource_type: "image",
                },
                (error, result) => {
                  if (error) {
                    reject(error);
                    return;
                  }

                  resolve(result);
                }
              );

            streamifier
              .createReadStream(
                req.file.buffer
              )
              .pipe(uploadStream);
          }
        );

      res.json({
        success: true,
        imageUrl:
          uploadResult.secure_url,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: "Internal server error",
      });
    }
  };

export const getConversation =
  async (req, res) => {
    try {
      await markConversationAsReadService(
        req.user.id,
        req.params.userId
      );

      const messages =
        await getConversationService(
          req.user.id,
          req.params.userId
        );

      res.json(messages);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: "Internal server error",
      });
    }
  };

export const getInbox =
  async (req, res) => {
    try {
      const messages =
        await getInboxService(
          req.user.id
        );

      res.json(messages);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: "Internal server error",
      });
    }
  };

export const getUnreadMessagesCount =
  async (req, res) => {
    try {
      const unreadCount =
        await getUnreadMessagesCountService(
          req.user.id
        );

      res.json({
        unreadCount,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: "Internal server error",
      });
    }
  };
  export const deleteMessage =
  async (req, res) => {
    try {
      const deleted =
        await deleteMessageService(
          req.params.id,
          req.user.id
        );

      if (!deleted) {
        return res.status(404).json({
          error: "Messaggio non trovato",
        });
      }

      res.json({
        success: true,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: "Internal server error",
      });
    }
  };
 export const addReaction =
  async (req, res) => {
    try {
      const reaction =
        await addReactionService(
          req.params.id,
          req.user.id,
          req.body.reaction
        );

      const io = getIO();

      io.emit("reaction-added", {
        messageId: req.params.id,
        reaction: req.body.reaction,
      });

      res.json(reaction);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: "Internal server error",
      });
    }
  };

export const getMessageReactions =
  async (req, res) => {
    try {
      const reactions =
        await getMessageReactionsService(
          req.params.id
        );

      res.json(reactions);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: "Internal server error",
      });
    }
  };
  export const editMessage =
  async (req, res) => {
    try {
      const updated =
        await editMessageService(
          req.params.id,
          req.user.id,
          req.body.message
        );

      if (!updated) {
        return res.status(404).json({
          error: "Messaggio non trovato",
        });
      }

      const io = getIO();

      io.emit(
        "message-edited",
        updated
      );

      res.json(updated);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: "Internal server error",
      });
    }
  };