import { useEffect, useState } from "react";
import {
  Link,
  useSearchParams,
} from "react-router-dom";
import { getAllServices } from "../api/customer";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from "../api/favorites";

export default function PublicServices() {
 const [services, setServices] =
  useState([]);

const [favorites, setFavorites] =
  useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [minPrice, setMinPrice] =
    useState("");

  const [maxPrice, setMaxPrice] =
    useState("");

  const [minRating, setMinRating] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [city, setCity] =
    useState("");
const [sortBy, setSortBy] =
  useState("rating");
  const [searchParams] =
    useSearchParams();

  const categories = [
    "Babysitter",
    "Dog Sitting",
    "Pet Care",
    "Pet Walking",
    "Pet Taxi",
    "Pulizie",
    "Colf",
    "Giardinaggio",
    "Personal Trainer",
    "Yoga",
    "Fitness",
    "Lezioni Private",
    "Ripetizioni",
    "Lingue",
    "Musica",
    "Web Design",
    "Sviluppo Software",
    "Graphic Design",
    "Digital Marketing",
    "Fotografia",
    "Videomaking",
    "Consulenza",
    "Business",
    "Commercialista",
    "Traslochi",
    "Trasporti",
    "Massaggi",
    "Benessere",
    "Beauty",
    "Eventi",
    "Wedding Planner",
    "Assistenza Anziani",
    "Badante",
    "Falegname",
    "Idraulico",
    "Elettricista",
    "Imbianchino",
    "Altro",
  ];

  useEffect(() => {
    loadServices();

    const categoryFromUrl =
      searchParams.get("category");

    if (categoryFromUrl) {
      setCategory(categoryFromUrl);
    }
  }, [searchParams]);

  async function loadServices() {
  try {
    const res =
      await getAllServices();

    setServices(res.data || []);

    try {
      const favoritesRes =
        await getFavorites();

      setFavorites(
        favoritesRes.data.map(
          (favorite) =>
            favorite.id
        )
      );
    } catch {
      // utente non autenticato
    }

  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
}
async function toggleFavorite(
  serviceId
) {
  try {
    const isFavorite =
      favorites.includes(
        serviceId
      );

    if (isFavorite) {

      await removeFavorite(
        serviceId
      );

      setFavorites(
        favorites.filter(
          (id) =>
            id !== serviceId
        )
      );

    } else {

      await addFavorite(
        serviceId
      );

      setFavorites([
        ...favorites,
        serviceId,
      ]);
    }

  } catch (error) {
    console.error(error);
  }
}
const filteredServices = services
  .filter((service) => {
    const matchesSearch =
      service.title
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        ) ||
      service.description
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        );

    const matchesMinPrice =
      !minPrice ||
      Number(service.price) >=
        Number(minPrice);

    const matchesMaxPrice =
      !maxPrice ||
      Number(service.price) <=
        Number(maxPrice);

    const matchesRating =
      !minRating ||
      Number(
        service.average_rating
      ) >= Number(minRating);

    const matchesCategory =
      !category ||
      service.category === category;

    const matchesCity =
      !city ||
      service.city
        ?.toLowerCase()
        .includes(
          city.toLowerCase()
        );

    return (
      matchesSearch &&
      matchesMinPrice &&
      matchesMaxPrice &&
      matchesRating &&
      matchesCategory &&
      matchesCity
    );
  })
  .sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return (
          Number(a.price) -
          Number(b.price)
        );

      case "price-desc":
        return (
          Number(b.price) -
          Number(a.price)
        );

      case "reviews":
        return (
          Number(b.total_reviews) -
          Number(a.total_reviews)
        );

      case "newest":
        return b.id - a.id;

      case "rating":
      default:
        return (
          Number(b.average_rating) -
          Number(a.average_rating)
        );
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Caricamento servizi...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">
            Tutti i Servizi
          </h1>

          <Link
            to="/"
            className="border px-4 py-2 rounded"
          >
            Home
          </Link>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Cerca un servizio..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="
              w-full
              p-4
              border
              rounded-xl
              bg-white
              shadow-sm
            "
          />
        </div>

        <div className="grid md:grid-cols-5 gap-4 mb-8">

          <input
            type="number"
            placeholder="💰 Prezzo minimo"
            value={minPrice}
            onChange={(e) =>
              setMinPrice(
                e.target.value
              )
            }
            className="p-3 border rounded-xl bg-white"
          />

          <input
            type="number"
            placeholder="💰 Prezzo massimo"
            value={maxPrice}
            onChange={(e) =>
              setMaxPrice(
                e.target.value
              )
            }
            className="p-3 border rounded-xl bg-white"
          />
<select
  value={sortBy}
  onChange={(e) =>
    setSortBy(e.target.value)
  }
  className="p-3 border rounded-xl bg-white"
>
  <option value="rating">
    ⭐ Miglior rating
  </option>

  <option value="reviews">
    📝 Più recensioni
  </option>

  <option value="price-asc">
    💰 Prezzo crescente
  </option>

  <option value="price-desc">
    💰 Prezzo decrescente
  </option>

  <option value="newest">
    🆕 Più recenti
  </option>
</select>
          <select
            value={minRating}
            onChange={(e) =>
              setMinRating(
                e.target.value
              )
            }
            className="p-3 border rounded-xl bg-white"
          >
            <option value="">
              ⭐ Rating minimo
            </option>

            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5</option>
          </select>

          <select
            value={category}
            onChange={(e) =>
              setCategory(
                e.target.value
              )
            }
            className="p-3 border rounded-xl bg-white"
          >
            <option value="">
              📂 Tutte le categorie
            </option>

            {categories.map((cat) => (
              <option
                key={cat}
                value={cat}
              >
                {cat}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="📍 Città"
            value={city}
            onChange={(e) =>
              setCity(
                e.target.value
              )
            }
            className="p-3 border rounded-xl bg-white"
          />

        </div>

        {filteredServices.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow text-center">
            Nessun servizio trovato.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

            {filteredServices.map(
              (service) => (
                <div
  key={service.id}
  className="
    relative
    bg-white
    rounded-xl
    shadow
    overflow-hidden
    hover:shadow-lg
    transition
  "
>
                  {service.image_url ? (
                    <img
                      src={service.image_url}
                      alt={service.title}
                      className="w-full h-56 object-cover"
                    />
                  ) : (
                    <div className="h-56 bg-gray-200 flex items-center justify-center">
                      Nessuna immagine
                    </div>
                  )}

                  <div className="p-5">

  <div className="absolute top-3 right-3 z-10">

  <button
  type="button"
  onClick={() =>
    toggleFavorite(service.id)
  }
  className={`
    w-12
    h-12
    rounded-full
    shadow-lg
    flex
    items-center
    justify-center
    text-2xl
    transition
    hover:scale-110
    ${
      favorites.includes(service.id)
        ? "bg-red-100 border-2 border-red-500"
        : "bg-white border-2 border-gray-300"
    }
  `}
>
  ❤️
</button>

</div>

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

  <div className="space-y-1 mb-3">

    {service.city && (
      <p className="text-gray-500 text-sm">
        📍 {service.city}
      </p>
    )}
  <div className="flex items-center gap-2 mt-1">
  {service.profile_image && (
    <img
      src={service.profile_image}
      alt={service.provider_name}
      className="w-8 h-8 rounded-full object-cover border border-gray-200"
    />
  )}

  <div className="flex flex-col">
    <Link
      to={`/provider/${service.provider_id}`}
      className="text-sm font-medium text-blue-600 hover:underline"
    >
      {service.provider_name}
    </Link>

    {service.provider_status === "approved" && (
      <span className="text-xs text-green-600 font-semibold">
        ✅ Provider verificato
      </span>
    )}
  <div className="text-sm text-yellow-600 font-semibold">
  ⭐ {service.average_rating}
  {" "}
  ({service.total_reviews} recensioni)
</div>
  </div>
</div>
    <div className="flex flex-wrap gap-2">

      {service.provider_status ===
        "approved" && (
        <span
          className="
            bg-green-100
            text-green-700
            text-xs
            font-bold
            px-2
            py-1
            rounded-full
          "
        >
          ✅ Verificato
        </span>
      )}

      {Number(
        service.average_rating
      ) >= 4.5 &&
        Number(
          service.total_reviews
        ) >= 5 && (
          <span
            className="
              bg-amber-100
              text-amber-700
              text-xs
              font-bold
              px-2
              py-1
              rounded-full
            "
          >
            🏆 Top Rated
          </span>
      )}

    </div>

  </div>
<h2 className="text-xl font-bold">
  {service.title}
</h2>

<p className="text-gray-600 mt-2">
  {service.description?.length > 120
    ? `${service.description.slice(
        0,
        120
      )}...`
    : service.description}
</p>

<div className="mt-4 flex items-center justify-between">

  <span className="text-yellow-500 font-bold text-lg">
    ⭐ {service.average_rating || 0}/5
  </span>

  <span className="text-sm text-gray-500">
    📝 {service.total_reviews || 0} recensioni
  </span>

</div>

<p className="mt-4 text-2xl font-bold text-green-600">
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
    py-3
    rounded-lg
    hover:bg-blue-700
  "
>
  Visualizza
</Link>

     </div>
                </div>
              )
            )}

          </div>
        )}
      </div>
    </div>
  );
}             