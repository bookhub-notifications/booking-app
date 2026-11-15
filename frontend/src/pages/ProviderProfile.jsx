import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config/api";

export default function ProviderProfile() {
  const { id } = useParams();

  const [provider, setProvider] =
    useState(null);

  const [services, setServices] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadProvider();
  }, [id]);

  async function loadProvider() {
  try {
    const res = await axios.get(
      `${API_BASE_URL}/provider/public/${id}`
    );

    console.log(
      "PROVIDER:",
      res.data.provider
    );

    setProvider(
      res.data.provider
    );

    setServices(
      res.data.services
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

  if (!provider) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Provider non trovato
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

        <div className="bg-white rounded-xl shadow p-8 mt-6">
<div className="mb-6">
  {provider.profile_image ? (
    <img
      src={provider.profile_image}
      alt={provider.name}
      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
    />
  ) : (
    <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-4xl">
      👤
    </div>
  )}
</div>
          <h1 className="text-4xl font-bold">
            {provider.name}
          </h1>

          {provider.city && (
            <p className="mt-3 text-gray-600 text-lg">
              📍 {provider.city}
            </p>
          )}

          {provider.status === "approved" && (
            <p className="mt-2 text-green-600 font-semibold">
              ✅ Provider verificato
            </p>
          )}

          <div className="mt-6 flex gap-6 flex-wrap">

            <div className="font-semibold">
              ⭐ {provider.average_rating}
            </div>

            <div className="text-gray-600">
              {provider.total_reviews} recensioni
            </div>

          </div>

          <div className="mt-6 space-y-2">

  <p>
    📧 {provider.email}
  </p>

  <p>
    📱 {provider.phone}
  </p>

  <div className="mt-4 flex flex-wrap gap-3">

    {provider.email && (
      <a
        href={`mailto:${provider.email}`}
        className="
          bg-blue-600
          text-white
          px-4
          py-2
          rounded-lg
          hover:bg-blue-700
        "
      >
        📧 Invia Email
      </a>
    )}

    {provider.phone && (
      <a
        href={`tel:${provider.phone}`}
        className="
          bg-green-600
          text-white
          px-4
          py-2
          rounded-lg
          hover:bg-green-700
        "
      >
        📞 Chiama
      </a>
    )}
{provider.user_id && (
  <Link
    to={`/messages/${provider.user_id}`}
    className="
      bg-purple-600
      text-white
      px-4
      py-2
      rounded-lg
      hover:bg-purple-700
      transition
    "
  >
    💬 Contatta Provider
  </Link>
)}
  </div>

</div>

        </div>

        <div className="mt-10">

          <h2 className="text-3xl font-bold mb-6">
            Servizi Pubblicati
          </h2>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-xl shadow overflow-hidden"
              >

                {service.image_url ? (
                  <img
                    src={service.image_url}
                    alt={service.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    Nessuna immagine
                  </div>
                )}

                <div className="p-5">

                  {service.category && (
                    <span
                      className="
                        inline-block
                        mb-3
                        bg-blue-100
                        text-blue-700
                        text-xs
                        font-semibold
                        px-3
                        py-1
                        rounded-full
                      "
                    >
                      🏷️ {service.category}
                    </span>
                  )}

                  <h3 className="font-bold text-xl">
                    {service.title}
                  </h3>

                  <p className="text-gray-600 mt-2">
                    {service.description}
                  </p>

                  <p className="mt-4 font-bold text-green-600 text-xl">
                    € {service.price}
                  </p>

                  <Link
                    to={`/service/${service.id}`}
                    className="
                      block
                      mt-4
                      text-center
                      bg-blue-600
                      text-white
                      py-2
                      rounded-lg
                      hover:bg-blue-700
                    "
                  >
                    Visualizza
                  </Link>

                </div>

              </div>
            ))}

          </div>

        </div>

      </div>
    </div>
  );
}