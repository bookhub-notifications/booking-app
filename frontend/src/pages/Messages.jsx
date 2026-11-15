import {
  useEffect,
  useState,
  useRef,
} from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config/api";
import {
  getConversation,
  sendMessage,
  uploadMessageImage,
  deleteMessage,
  editMessage,
  addReaction,
  getMessageReactions,
} from "../api/messages";

export default function Messages() {
  const { userId } = useParams();

  const [messages, setMessages] = useState([]);
  const [reactions, setReactions] =
  useState({});
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] =
  useState(null);
const [replyTo, setReplyTo] =
  useState(null);
const [editingText, setEditingText] =
  useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
const [selectedImage, setSelectedImage] =
  useState(null);
const [imagePreview, setImagePreview] =
  useState("");
  const messagesEndRef = useRef(null);
const socketRef = useRef(null);
  const currentUserId = Number(
    localStorage.getItem("userId")
  );

  useEffect(() => {
  loadConversation();
}, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);
useEffect(() => {
  socketRef.current = io(
    "http://localhost:5000"
  );

  socketRef.current.emit(
    "join",
    currentUserId
  );

  socketRef.current.on(
  "new-message",
  (data) => {
    console.log(
      "SOCKET MESSAGE RECEIVED:",
      data
    );

    setMessages((prev) => {
      const exists = prev.some(
        (msg) => msg.id === data.id
      );

      if (exists) {
        return prev;
      }

      return [...prev, data];
    });
  }
);
socketRef.current.on(
  "reaction-added",
  async ({ messageId }) => {
    try {
      const res =
        await getMessageReactions(
          messageId
        );

      setReactions((prev) => ({
        ...prev,
        [messageId]: res.data,
      }));
    } catch (error) {
      console.error(error);
    }
  }
);
socketRef.current.on(
  "user-typing",
  () => {
    setIsTyping(true);

    clearTimeout(window.typingTimer);

    window.typingTimer = setTimeout(() => {
      setIsTyping(false);
    }, 1500);
  }
);
 socketRef.current.on(
  "user-online",
  (id) => {
    if (Number(id) === Number(userId)) {
      setIsOnline(true);
    }
  }
);

socketRef.current.on(
  "user-offline",
  (id) => {
    if (Number(id) === Number(userId)) {
      setIsOnline(false);
    }
  }
);
return () => {
  socketRef.current?.off("new-message");
  socketRef.current?.off("reaction-added");
  socketRef.current?.off("user-typing");
  socketRef.current?.off("user-online");
  socketRef.current?.off("user-offline");
  socketRef.current?.disconnect();
};
}, []);
  async function loadConversation() {
    try {
      const res = await getConversation(userId);

      setMessages(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
async function handleSend() {
  if (
    !message.trim() &&
    !selectedImage
  ) {
    return;
  }

  try {
    setSending(true);

    let imageUrl = null;

    if (selectedImage) {
      const formData = new FormData();

      formData.append(
        "image",
        selectedImage
      );

      const uploadRes =
        await uploadMessageImage(
          formData
        );

      imageUrl =
        uploadRes.data.imageUrl;
    }

    await sendMessage({
  receiver_id: Number(userId),
  message: message.trim(),
  image_url: imageUrl,
  reply_to: replyTo?.id || null,
});

    setMessage("");
    setReplyTo(null);
    setSelectedImage(null);
    setImagePreview("");

    await loadConversation();
  } catch (error) {
    console.error(error);
  } finally {
    setSending(false);
  }
}
async function handleDelete(id) {
  const confirmDelete =
    window.confirm(
      "Eliminare questo messaggio?"
    );

  if (!confirmDelete) return;

  try {
    await deleteMessage(id);

    setMessages((prev) =>
      prev.filter(
        (msg) => msg.id !== id
      )
    );
  } catch (error) {
    console.error(error);
  }
}
async function handleReaction(
  messageId,
  emoji
) {
  try {
    await addReaction(
      messageId,
      emoji
    );

    const res =
      await getMessageReactions(
        messageId
      );

    setReactions((prev) => ({
      ...prev,
      [messageId]: res.data,
    }));
  } catch (error) {
    console.error(error);
  }
}
async function handleEdit(
  messageId
) {
  try {
    await editMessage(
      messageId,
      editingText
    );

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              message:
                editingText,
              edited: true,
            }
          : msg
      )
    );

    setEditingId(null);
    setEditingText("");
  } catch (error) {
    console.error(error);
  }
}
const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Caricamento...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto p-6">

        <div
          className="
            bg-white
            rounded-xl
            shadow
            p-4
            mb-4
            flex
            items-center
            gap-4
          "
        >
          <div
            className="
              w-12
              h-12
              rounded-full
              bg-purple-600
              text-white
              flex
              items-center
              justify-center
              font-bold
              text-lg
            "
          >
            J
          </div>

          <div>
  <h1 className="font-bold text-xl">
    Jack Hill
  </h1>

 {isTyping ? (
  <p className="text-green-600 text-sm animate-pulse">
    Sta scrivendo...
  </p>
) : (
  <p
    className={`text-sm ${
      isOnline
        ? "text-green-600"
        : "text-gray-500"
    }`}
  >
    {isOnline
      ? "🟢 Online"
      : "⚫ Offline"}
  </p>
)}
</div>
        </div>

        <div
          className="
            bg-gradient-to-b
from-gray-50
to-gray-100
            rounded-xl
            shadow
            p-4
           min-h-[500px]
max-h-[65vh]
            overflow-y-auto
            space-y-3
          "
        >
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              Nessun messaggio trovato.
            </div>
          ) : (
            messages.map((msg) => {
              const isMine =
                Number(msg.sender_id) ===
                currentUserId;

              return (
                <div
                  key={msg.id}
                  className={`flex ${
                    isMine
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`
                      max-w-[75%]
                      px-4
                      py-3
                      rounded-2xl
                      break-words
                      shadow-sm
                      ${
                        isMine
                          ? "bg-purple-600 text-white"
                          : "bg-gray-200 text-gray-800"
                      }
                    `}
                  >
                    {msg.image_url && (
  <img
    src={msg.image_url}
    alt=""
    className="
      rounded-lg
      mb-2
      max-w-xs
    "
  />
)}
{msg.reply_message && (
  <div
    className="
      mb-2
      p-2
      rounded-lg
      border-l-4
      border-purple-300
      bg-white/10
      text-sm
      opacity-90
    "
  >
    <p className="text-xs opacity-70 mb-1">
      Risposta a
    </p>

    <p className="truncate">
      {msg.reply_message}
    </p>
  </div>
)}
{editingId === msg.id ? (
  <div className="mt-2">
    <input
      value={editingText}
      onChange={(e) =>
        setEditingText(
          e.target.value
        )
      }
      className="
        w-full
        border
        rounded
        px-2
        py-1
        text-black
      "
    />

    <button
      onClick={() =>
        handleEdit(msg.id)
      }
      className="
        mt-2
        bg-green-500
        text-white
        px-3
        py-1
        rounded
      "
    >
      Salva
    </button>
  </div>
) : (
  <>
    <p>{msg.message}</p>

    {msg.edited && (
  <p className="text-xs italic opacity-70">
    modificato
  </p>
)}
  </>
)}
<div className="flex gap-1 mt-2">
  {["👍", "❤️", "😂", "😮", "😢"].map(
    (emoji) => (
      <button
        key={emoji}
        onClick={() =>
          handleReaction(
            msg.id,
            emoji
          )
        }
        className="
          text-lg
          hover:scale-110
          transition
        "
      >
        {emoji}
      </button>
    )
  )}
</div>
{reactions[msg.id]?.length > 0 && (
  <div className="flex gap-2 mt-1">
    {reactions[msg.id].map(
      (r) => (
        <span
          key={r.reaction}
          className="
  text-xs
  bg-white
  text-purple-700
  font-semibold
  px-3
  py-1
  rounded-full
  shadow-sm
"
        >
          {r.reaction} {r.count}
        </span>
      )
    )}
  </div>
)}
{isMine && (
  <div className="flex items-center gap-2 mt-1">
    <span
      className={
        msg.is_read
          ? "text-blue-300"
          : ""
      }
    >
      ✓✓
    </span>

    <button
  type="button"
  onClick={() =>
    handleDelete(msg.id)
  }
  title="Elimina messaggio"
  className="
    ml-2
    text-red-200
    text-lg
    cursor-pointer
    hover:text-red-100
    hover:scale-110
    transition
  "
>
  <button
  onClick={() => {
    setEditingId(msg.id);
    setEditingText(
      msg.message
    );
  }}
  title="Modifica messaggio"
  className="
    text-yellow-200
    text-lg
    cursor-pointer
  "
>
  <button
  onClick={() =>
    setReplyTo(msg)
  }
  title="Rispondi"
  className="
    text-blue-200
    text-lg
    cursor-pointer
  "
>
  ↩️
</button>
  ✏️
</button>
  🗑️
</button>
  </div>
)}
                  </div>
                </div>
              );
            })
          )}

          <div ref={messagesEndRef} />
        </div>
{imagePreview && (
  <div className="mb-3">
    <img
      src={imagePreview}
      alt=""
      className="
        max-h-48
        rounded-lg
        border
      "
    />
  </div>
)}
        <div className="flex gap-3 mt-4">
  {replyTo && (
  <div
    className="
      mb-3
      p-3
      bg-gray-100
      border-l-4
      border-purple-500
      rounded
    "
  >
    <div className="text-xs text-gray-500">
      Risposta a:
    </div>

    <div className="text-sm truncate">
      {replyTo.message}
    </div>

    <button
      onClick={() =>
        setReplyTo(null)
      }
      className="
        text-red-500
        text-xs
        mt-1
      "
    >
      Annulla
    </button>
  </div>
)}
  <input
    type="text"
    value={message}
    onChange={(e) => {
      setMessage(e.target.value);

      socketRef.current?.emit(
        "typing",
        {
          senderId: currentUserId,
          receiverId: Number(userId),
        }
      );
    }}
    onKeyDown={handleKeyDown}
    placeholder="Scrivi un messaggio..."
    className="
      flex-1
      border
      border-gray-300
      rounded-lg
      px-4
      py-3
      focus:outline-none
      focus:ring-2
      focus:ring-purple-500
    "
  />

  <label
    className="
      cursor-pointer
      bg-gray-200
      px-4
      py-3
      rounded-lg
    "
  >
    📷

    <input
      type="file"
      accept="image/*"
      className="hidden"
      onChange={(e) => {
        const file =
          e.target.files?.[0];

        if (!file) return;

        setSelectedImage(file);

        setImagePreview(
          URL.createObjectURL(file)
        );
      }}
    />
  </label>

  <button
    onClick={handleSend}
    disabled={sending}
    className="
      bg-purple-600
      text-white
      px-6
      py-3
      rounded-lg
      hover:bg-purple-700
      disabled:opacity-50
    "
  >
    {sending ? "Invio..." : "Invia"}
  </button>
</div>

      </div>
    </div>
  );
}