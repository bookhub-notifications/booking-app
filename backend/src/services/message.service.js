import { pool } from "../config/db.js";

export const sendMessageService = async (
  senderId,
  receiverId,
  message,
  imageUrl = null,
  replyTo = null
) => {
  const result = await pool.query(
    `
    INSERT INTO messages (
      sender_id,
      receiver_id,
      message,
      image_url,
      reply_to
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
    [
      senderId,
      receiverId,
      message,
      imageUrl,
      replyTo,
    ]
  );

  return result.rows[0];
};

export const getConversationService = async (
  userId,
  otherUserId
) => {
  const result = await pool.query(
    `
    SELECT
      m.*,
      replied.message AS reply_message
    FROM messages m
    LEFT JOIN messages replied
      ON replied.id = m.reply_to
    WHERE
      (
        m.sender_id = $1
        AND m.receiver_id = $2
      )
      OR
      (
        m.sender_id = $2
        AND m.receiver_id = $1
      )
    ORDER BY m.created_at ASC
    `,
    [
      userId,
      otherUserId,
    ]
  );

  return result.rows;
};
export const getInboxService = async (
  userId
) => {
  const result = await pool.query(
    `
    SELECT *
    FROM messages
    WHERE
      sender_id = $1
      OR receiver_id = $1
    ORDER BY created_at DESC
    `,
    [userId]
  );

  return result.rows;
};
export const markConversationAsReadService =
  async (
    currentUserId,
    otherUserId
  ) => {
    await pool.query(
      `
      UPDATE messages
      SET is_read = TRUE
      WHERE
        receiver_id = $1
        AND sender_id = $2
        AND is_read = FALSE
      `,
      [
        currentUserId,
        otherUserId,
      ]
    );
  };

export const getUnreadMessagesCountService =
  async (userId) => {
    const result = await pool.query(
      `
      SELECT COUNT(*)::integer AS unread_count
      FROM messages
      WHERE
        receiver_id = $1
        AND is_read = FALSE
      `,
      [userId]
    );

    return result.rows[0].unread_count;
  };

export const deleteMessageService =
  async (
    messageId,
    userId
  ) => {
    const result = await pool.query(
      `
      DELETE FROM messages
      WHERE id = $1
      AND sender_id = $2
      RETURNING *
      `,
      [
        messageId,
        userId,
      ]
    );

    return result.rows[0];
  };

export const addReactionService =
  async (
    messageId,
    userId,
    reaction
  ) => {

    const existing =
      await pool.query(
        `
        SELECT id
        FROM message_reactions
        WHERE
          message_id = $1
          AND user_id = $2
          AND reaction = $3
        `,
        [
          messageId,
          userId,
          reaction,
        ]
      );

    if (
      existing.rows.length > 0
    ) {
      await pool.query(
        `
        DELETE FROM message_reactions
        WHERE
          message_id = $1
          AND user_id = $2
          AND reaction = $3
        `,
        [
          messageId,
          userId,
          reaction,
        ]
      );

      return {
        removed: true,
      };
    }

    const result =
      await pool.query(
        `
        INSERT INTO message_reactions (
          message_id,
          user_id,
          reaction
        )
        VALUES ($1, $2, $3)
        RETURNING *
        `,
        [
          messageId,
          userId,
          reaction,
        ]
      );

    return result.rows[0];
  };
export const getMessageReactionsService =
  async (messageId) => {
    const result = await pool.query(
      `
      SELECT
        reaction,
        COUNT(*)::integer AS count
      FROM message_reactions
      WHERE message_id = $1
      GROUP BY reaction
      ORDER BY reaction
      `,
      [messageId]
    );

    return result.rows;
  };
  export const editMessageService =
  async (
    messageId,
    userId,
    message
  ) => {
    const result = await pool.query(
      `
      UPDATE messages
      SET
        message = $3,
        edited = TRUE,
        edited_at = NOW()
      WHERE
        id = $1
        AND sender_id = $2
      RETURNING *
      `,
      [
        messageId,
        userId,
        message,
      ]
    );

    return result.rows[0];
  };