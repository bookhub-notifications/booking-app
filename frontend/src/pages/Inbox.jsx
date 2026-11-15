import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getInbox } from "../api/messages";

export default function Inbox() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInbox();
  }, []);

  async function loadInbox() {
    try {
      const res = await getInbox();

      console.log(
        "INBOX RESPONSE:",
        res.data
      );

      setMessages(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const conversations = [];
  const seenUsers = new Set();

  messages.forEach((msg) => {
    const currentUserId = Number(
      localStorage.getItem("userId")
    );

    const otherUser =
      Number(msg.sender_id) === currentUserId
        ? msg.receiver_id
        : msg.sender_id;

    if (!seenUsers.has(otherUser)) {
      seenUsers.add(otherUser);

      conversations.push({
        ...msg,
        otherUser,
      });
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Caricamento...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto p-6">

        <h1 className="text-3xl font-bold mb-6">
          💬 Messaggi
        </h1>

        <div className="bg-white rounded-xl shadow overflow-hidden">

          {conversations.length === 0 ? (
            <div className="p-6 text-gray-500">
              Nessuna conversazione disponibile.
            </div>
          ) : (
            conversations.map((msg) => (
              <Link
                key={msg.id}
                to={`/messages/${msg.otherUser}`}
                className="
                  block
                  border-b
                  p-4
                  hover:bg-gray-50
                  transition
                "
              >
                <div className="font-semibold text-lg">
                  {msg.otherUser === 63
                    ? "Jack Hill"
                    : `Utente #${msg.otherUser}`}
                </div>

                <div className="text-gray-600 mt-1 truncate">
                  {msg.message}
                </div>

                <div className="text-xs text-gray-400 mt-2">
                  {new Date(
                    msg.created_at
                  ).toLocaleString("it-IT")}
                </div>
              </Link>
            ))
          )}

        </div>

      </div>
    </div>
  );
}