import axios from "axios";
import { API_BASE_URL } from "../config/api";

const API = axios.create({
  baseURL: `${API_BASE_URL}/messages`,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export function getInbox() {
  return API.get("/");
}

export function getConversation(userId) {
  return API.get(
    `/conversation/${userId}`
  );
}

export function sendMessage(data) {
  return API.post("/", data);
}

export function getUnreadMessagesCount() {
  return API.get(
    "/unread-count"
  );
}

export function uploadMessageImage(
  formData
) {
  return API.post(
    "/upload",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );
}

export function deleteMessage(id) {
  return API.delete(`/${id}`);
}

export function editMessage(
  messageId,
  message
) {
  return API.put(
    `/${messageId}`,
    { message }
  );
}

export function addReaction(
  messageId,
  reaction
) {
  return API.post(
    `/${messageId}/reaction`,
    { reaction }
  );
}

export function getMessageReactions(
  messageId
) {
  return API.get(
    `/${messageId}/reactions`
  );
}
