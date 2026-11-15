import {
  addFavoriteService,
  removeFavoriteService,
  getFavoritesService,
} from "../services/favorite.service.js";

export const addFavorite =
  async (req, res) => {
    try {
      const favorite =
        await addFavoriteService(
          req.user.id,
          req.body.service_id
        );

      res.json(favorite);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: "Internal server error",
      });
    }
  };

export const removeFavorite =
  async (req, res) => {
    try {
      await removeFavoriteService(
        req.user.id,
        req.params.serviceId
      );

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

export const getFavorites =
  async (req, res) => {
    try {
      const favorites =
        await getFavoritesService(
          req.user.id
        );

      res.json(favorites);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: "Internal server error",
      });
    }
  };