import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getFavorites,
  removeFavorite,
} from "../api/favorites";

export default function Favorites() {
  const [favorites, setFavorites] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  async function loadFavorites() {
    try {
      const res =
        await getFavorites();

      const favoriteData =
        res.data || [];

      setFavorites(
        favoriteData
      );

      localStorage.setItem(
        "favoriteCount",
        favoriteData.length
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleRemoveFavorite(
    serviceId
  ) {
    try {
      await removeFavorite(
        serviceId
      );

      const updatedFavorites =
        favorites.filter(
          (service) =>
            service.id !== serviceId
        );

      setFavorites(
        updatedFavorites
      );

      localStorage.setItem(
        "favoriteCount",
        updatedFavorites.length
      );
    } catch (error) {
      console.error(error);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Caricamento...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">

        <h1 className="text-4xl font-bold mb-8">
          ❤️ I miei Preferiti
        </h1>

        {favorites.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow">
            Nessun preferito salvato.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

            {favorites.map((service) => (
              <div
                key={service.id}
                className="
                  bg-white
                  rounded-xl
                  shadow
                  overflow-hidden
                "
              >

                {service.image_url && (
                  <img
                    src={service.image_url}
                    alt={service.title}
                    className="w-full h-56 object-cover"
                  />
                )}

                <div className="p-5">

                  <h2 className="text-xl font-bold">
                    {service.title}
                  </h2>

                  <p className="text-gray-600 mt-2">
                    {service.description}
                  </p>

                  <p className="mt-4 text-xl font-bold text-green-600">
                    € {service.price}
                  </p>

                  <div className="mt-4 flex gap-3">

                    <Link
                      to={`/service/${service.id}`}
                      className="
                        flex-1
                        text-center
                        bg-blue-600
                        text-white
                        py-3
                        rounded-lg
                        hover:bg-blue-700
                      "
                    >
                      Visualizza
                    </Link>

                    <button
                      onClick={() =>
                        handleRemoveFavorite(
                          service.id
                        )
                      }
                      className="
                        px-4
                        bg-red-500
                        text-white
                        rounded-lg
                        hover:bg-red-600
                        transition
                      "
                    >
                      ❤️ Rimuovi
                    </button>

                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}