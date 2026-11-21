import axios from "axios";
import { API_BASE_URL } from "../config/api";

const API = axios.create({
  baseURL: `${API_BASE_URL}/provider`,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export function uploadDocument(file) {
  const formData = new FormData();

  formData.append("document", file);

  return API.post(
    "/upload-document",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );
}
export function uploadProfileImage(file) {
  const formData = new FormData();

  formData.append("image", file);

  return API.post(
    "/profile-image",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );
}
export function createListing(
  title,
  description,
  price,
  category,
  image
) {
  const formData = new FormData();

  formData.append("title", title);
  formData.append("description", description);
  formData.append("price", price);
  formData.append("category", category);

  if (image) {
    formData.append("image", image);
  }

  return API.post(
    "/create-listing",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );
}

export function createSlot(
  service_id,
  date,
  start_time,
  end_time
) {
  return API.post(
    "/create-slot",
    {
      service_id,
      date,
      start_time,
      end_time,
    }
  );
}

export function getMyServices() {
  return API.get("/services");
}

export function deleteService(id) {
  return API.delete(
    `/service/${id}`
  );
}

export function updateService(
  id,
  data
) {
  return API.put(
    `/service/${id}`,
    data
  );
}

export function getProviderBookings() {
  return API.get("/bookings");
}

export function getProviderAnalytics() {
  return API.get("/analytics");
}

export function getNotifications() {
  return API.get(
    "/notifications"
  );
}

export function markNotificationAsRead(
  id
) {
  return API.patch(
    `/notifications/${id}/read`
  );
}

/*
=====================================
PROVIDER PROFILE
=====================================
*/

export function createProviderProfile(
  name,
  phone,
  city
) {
  return API.post("/create", {
    name,
    phone,
    city,
  });
}

export function getMySlots() {
  return API.get("/my-slots");
}
export function deleteSlot(id) {
  return API.delete(
    `/slot/${id}`
  );
}
export function freeSlot(
  reservationId
) {
  return axios.post(
    `${API_BASE_URL}/reservations/cancel/${reservationId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(
          "token"
        )}`,
      },
    }
  );
}