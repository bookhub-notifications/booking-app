import axios from "axios";
import { API_BASE_URL } from "../config/api";

const API = axios.create({
  baseURL: `${API_BASE_URL}/favorites`,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization =
      `Bearer ${token}`;
  }

  return config;
});

export function getFavorites() {
  return API.get("/");
}

export function addFavorite(
  service_id
) {
  return API.post("/", {
    service_id,
  });
}

export function removeFavorite(
  serviceId
) {
  return API.delete(
    `/${serviceId}`
  );
}