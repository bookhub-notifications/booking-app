import express from "express";
import { auth } from "../middleware/auth.js";

import {
  addFavorite,
  removeFavorite,
  getFavorites,
} from "../controllers/favorite.controller.js";

const router = express.Router();

router.get(
  "/",
  auth,
  getFavorites
);

router.post(
  "/",
  auth,
  addFavorite
);

router.delete(
  "/:serviceId",
  auth,
  removeFavorite
);

export default router;