import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}

      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          <h1 className="text-3xl font-bold text-blue-600">
            BookHub
          </h1>

          <div className="flex gap-3">

            <Link
              to="/login"
              className="border px-4 py-2 rounded"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Registrati
            </Link>

          </div>

        </div>
      </header>

      {/* HERO */}

      <section className="text-center py-24 px-6">

        <h2 className="text-5xl font-bold mb-6">
          Trova il professionista
          perfetto
        </h2>

        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Prenota servizi in modo semplice,
          sicuro e veloce.
        </p>

        <div className="mt-8 flex justify-center gap-4">

          <Link
            to="/services"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Cerca Servizi
          </Link>

          <Link
            to="/register"
            className="border px-6 py-3 rounded-lg"
          >
            Diventa Provider
          </Link>

        </div>

      </section>

      {/* CATEGORIE */}

      <section className="max-w-6xl mx-auto py-16 px-6">

        <h3 className="text-3xl font-bold text-center mb-12">
          Esplora per Categoria
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          <Link
            to="/services?category=Dog Sitting"
            className="bg-white shadow rounded-xl p-6 text-center hover:shadow-lg transition"
          >
            <div className="text-4xl">🐶</div>

            <div className="mt-3 font-semibold">
              Dog Sitting
            </div>
          </Link>

          <Link
            to="/services?category=Babysitter"
            className="bg-white shadow rounded-xl p-6 text-center hover:shadow-lg transition"
          >
            <div className="text-4xl">👶</div>

            <div className="mt-3 font-semibold">
              Babysitter
            </div>
          </Link>

          <Link
            to="/services?category=Pulizie"
            className="bg-white shadow rounded-xl p-6 text-center hover:shadow-lg transition"
          >
            <div className="text-4xl">🧹</div>

            <div className="mt-3 font-semibold">
              Pulizie
            </div>
          </Link>

          <Link
            to="/services?category=Fitness"
            className="bg-white shadow rounded-xl p-6 text-center hover:shadow-lg transition"
          >
            <div className="text-4xl">🏋️</div>

            <div className="mt-3 font-semibold">
              Fitness
            </div>
          </Link>

          <Link
            to="/services?category=Web Design"
            className="bg-white shadow rounded-xl p-6 text-center hover:shadow-lg transition"
          >
            <div className="text-4xl">💻</div>

            <div className="mt-3 font-semibold">
              Web Design
            </div>
          </Link>

          <Link
            to="/services?category=Fotografia"
            className="bg-white shadow rounded-xl p-6 text-center hover:shadow-lg transition"
          >
            <div className="text-4xl">📸</div>

            <div className="mt-3 font-semibold">
              Fotografia
            </div>
          </Link>

          <Link
            to="/services?category=Assistenza Anziani"
            className="bg-white shadow rounded-xl p-6 text-center hover:shadow-lg transition"
          >
            <div className="text-4xl">❤️</div>

            <div className="mt-3 font-semibold">
              Assistenza Anziani
            </div>
          </Link>

          <Link
            to="/services?category=Consulenza"
            className="bg-white shadow rounded-xl p-6 text-center hover:shadow-lg transition"
          >
            <div className="text-4xl">📈</div>

            <div className="mt-3 font-semibold">
              Consulenza
            </div>
          </Link>

        </div>

      </section>

      {/* TRUST SECTION */}

      <section className="bg-blue-600 text-white py-16">

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center">

          <div>
            ✅ Provider verificati
          </div>

          <div>
            💳 Pagamenti sicuri
          </div>

          <div>
            ⭐ Recensioni reali
          </div>

        </div>

      </section>

    </div>
  );
}