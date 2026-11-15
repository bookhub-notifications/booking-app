import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getServiceById } from "../api/customer";
import { getProviderReviews } from "../api/reviews";

export default function ServiceDetails() {
  const { id } = useParams();

  const [service, setService] =
    useState(null);

  const [reviews, setReviews] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadService();
  }, [id]);

  async function loadService() {
    try {
      const res =
        await getServiceById(id);

      setService(res.data);

      const reviewsRes =
        await getProviderReviews(
          res.data.provider_id
        );

      setReviews(
        reviewsRes.data || []
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Caricamento...
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Servizio non trovato
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-6xl mx-auto px-6 py-12">

        <Link
          to="/services"
          className="text-blue-600 hover:underline"
        >
          ← Torna ai servizi
        </Link>

        <div className="mt-8 bg-white rounded-xl shadow overflow-hidden">

          {service.image_url ? (
            <img
              src={service.image_url}
              alt={service.title}
              className="w-full h-[450px] object-cover"
            />
          ) : (
            <div className="h-[450px] bg-gray-200 flex items-center justify-center">
              Nessuna immagine
            </div>
          )}

          <div className="p-8">

            <h1 className="text-4xl font-bold">
              {service.title}
            </h1>

            <div className="mt-4 flex gap-6 items-center flex-wrap">

              <span className="text-yellow-500 font-bold">
                ⭐ {service.average_rating}
              </span>

              <span className="text-gray-500">
                ({service.total_reviews} recensioni)
              </span>

            </div>

            {/* PROVIDER */}

            <div className="mt-8 p-5 bg-gray-100 rounded-xl">

              <h3 className="text-lg font-semibold mb-2">
                Provider
              </h3>

              <p className="text-xl font-bold">
                {service.provider_name}
              </p>

              {service.provider_city && (
                <p className="text-gray-600 mt-2">
                  📍 {service.provider_city}
                </p>
              )}

              {service.provider_status ===
                "approved" && (
                <p className="text-green-600 mt-2 font-medium">
                  ✅ Provider verificato
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-3">

                <Link
                  to={`/provider/${service.provider_id}`}
                  className="
                    bg-blue-600
                    text-white
                    px-4
                    py-2
                    rounded-lg
                    hover:bg-blue-700
                  "
                >
                  Visualizza Profilo
                </Link>

              </div>

            </div>

            {/* DESCRIZIONE */}

            <div className="mt-8">

              <h2 className="text-xl font-semibold">
                Descrizione
              </h2>

              <p className="mt-3 text-gray-700">
                {service.description}
              </p>

            </div>

            {/* PREZZO */}

            <div className="mt-8">

              <span className="text-4xl font-bold text-green-600">
                € {service.price}
              </span>

            </div>

            {/* RECENSIONI */}

            <div className="mt-10">

              <h2 className="text-2xl font-bold mb-5">
                ⭐ Recensioni
              </h2>

              {reviews.length === 0 ? (
                <div className="bg-gray-100 p-5 rounded-xl">
                  Nessuna recensione disponibile.
                </div>
              ) : (
                <div className="space-y-4">

                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="
                        bg-gray-50
                        border
                        rounded-xl
                        p-5
                      "
                    >

                      <div className="flex justify-between mb-2">

                        <span className="font-bold text-yellow-600">
                          {"⭐".repeat(
                            review.rating
                          )}
                        </span>

                        <span className="text-sm text-gray-400">
                          {new Date(
                            review.created_at
                          ).toLocaleDateString(
                            "it-IT"
                          )}
                        </span>

                      </div>

                      <p className="text-gray-700">
                        {review.comment}
                      </p>

                      <p className="text-sm text-gray-500 mt-3">
                        — {review.customer_name}
                      </p>

                    </div>
                  ))}

                </div>
              )}

            </div>

            {/* CTA */}

            <div className="mt-8 flex gap-4 flex-wrap">

              <Link
                to="/login"
                className="
                  bg-blue-600
                  text-white
                  px-6
                  py-3
                  rounded-lg
                  hover:bg-blue-700
                "
              >
                Accedi per Prenotare
              </Link>

              <Link
                to="/register"
                className="
                  border
                  px-6
                  py-3
                  rounded-lg
                  hover:bg-gray-100
                "
              >
                Registrati
              </Link>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}