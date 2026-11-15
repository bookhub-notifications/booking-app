import {
  useEffect,
  useState,
  useRef,
} from "react";

import { io } from "socket.io-client";

import {
  getUnreadMessagesCount,
} from "../api/messages";

export default function GlobalSidebar() {
  const role =
    localStorage.getItem("role") || "admin";

  const favoriteCount = Number(
    localStorage.getItem(
      "favoriteCount"
    ) || 0
  );

  const [unreadCount, setUnreadCount] =
    useState(0);

  const socketRef = useRef(null);

  useEffect(() => {
    loadUnreadCount();

    const userId =
      localStorage.getItem("userId");

    if (!userId) return;

    socketRef.current = io(
      "http://localhost:5000"
    );

    socketRef.current.emit(
      "join",
      Number(userId)
    );

    socketRef.current.on(
      "new-message",
      () => {
        loadUnreadCount();
      }
    );

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  async function loadUnreadCount() {
    try {
      const res =
        await getUnreadMessagesCount();

      setUnreadCount(
        res.data.unreadCount || 0
      );
    } catch (error) {
      console.error(error);
    }
  }

  const messageLabel =
    unreadCount > 0
      ? `💬 Messaggi (${unreadCount})`
      : "💬 Messaggi";

  const links = {
    admin: [
      {
        label: "Dashboard",
        url: "/admin",
      },
      {
        label: "Provider Pending",
        url: "/admin/providers",
      },
      {
        label: "Services Pending",
        url: "/admin/services",
      },
      {
        label: "Prenotazioni",
        url: "/admin/reservations",
      },
      {
        label: "Utenti",
        url: "/admin/users",
      },
      {
        label: "Recensioni",
        url: "/admin/reviews",
      },
    ],

    provider: [
      {
        label: "Dashboard",
        url: "/provider",
      },
      {
        label: "Completa Profilo",
        url: "/provider/setup",
      },
      {
        label: "Upload Document",
        url: "/provider/upload-document",
      },
      {
        label: "Create Listing",
        url: "/provider/create-listing",
      },
      {
        label: "Create Slot",
        url: "/provider/create-slot",
      },
      {
        label: "Prenotazioni Ricevute",
        url: "/provider/bookings",
      },
      {
        label: "🛠 I Miei Servizi",
        url: "/provider/services",
      },
      {
        label: messageLabel,
        url: "/messages",
      },
    ],

    customer: [
      {
        label: "Dashboard",
        url: "/customer",
      },
      {
        label: "Services",
        url: "/customer/services",
      },
      {
        label: "My Bookings",
        url: "/customer/bookings",
      },
      {
        label: `❤️ My Favorites (${favoriteCount})`,
        url: "/favorites",
      },
      {
        label: messageLabel,
        url: "/messages",
      },
    ],
  };

  const color = {
    admin: "bg-gray-900",
    provider: "bg-blue-900",
    customer: "bg-green-900",
  };

  const menu = links[role] || [];

  return (
    <div
      className={`
        w-64
        ${color[role] || "bg-gray-900"}
        text-white
        h-screen
        p-4
      `}
    >
      <h2 className="text-xl font-bold mb-6 capitalize">
        {role} Panel
      </h2>

      <nav className="flex flex-col gap-4">
        {menu.map((item) => (
          <a
            key={item.url}
            href={item.url}
            className="
              hover:text-gray-300
              transition
            "
          >
            {item.label}
          </a>
        ))}
      </nav>
    </div>
  );
}