import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import VehicleCard from "../components/VehicleCard";

const CATEGORY_ICONS = {
  suv: "🚙",
  sedan: "🚗",
  hatchback: "🚘",
  pickup: "🛻",
  luxury: "✨",
  family: "👨‍👩‍👧",
  performance: "🏁",
  "hybrid-electric": "⚡",
};

export default function Home() {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search section state
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minYear, setMinYear] = useState("");
  const [bodyType, setBodyType] = useState("");

  useEffect(() => {
    Promise.all([
      api.getVehicles({ featured: "true", limit: 6 }),
      api.getCategories(),
      api.getMakes(),
    ])
      .then(([vehicleRes, categoryRes, makesRes]) => {
        setFeatured(vehicleRes.vehicles);
        setCategories(categoryRes);
        setMakes(makesRes);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Whenever the selected make changes, fetch the models that actually
  // exist for that make - this is what makes the dropdown "cascading"
  // rather than a free-text field.
  useEffect(() => {
    if (!selectedMake) {
      setModels([]);
      setSelectedModel("");
      return;
    }
    api
      .getModelsByMake(selectedMake)
      .then(setModels)
      .catch(() => setModels([]));
    setSelectedModel(""); // changing make invalidates whatever model was picked before
  }, [selectedMake]);

  function handleSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedMake) params.set("make", selectedMake);
    if (selectedModel) params.set("model", selectedModel);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (minYear) params.set("minYear", minYear);
    if (bodyType) params.set("bodyType", bodyType);
    navigate(`/cars?${params.toString()}`);
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[92vh] min-h-[600px] flex items-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2000"
          alt="A premium car on an open road at dusk"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/60 to-charcoal-950/20" />
        <div className="relative max-w-7xl mx-auto px-5 md:px-8 animate-fade-in">
          <p className="text-accent tracking-[0.2em] text-sm uppercase mb-4">
            DriveLux — Kenya
          </p>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl leading-tight max-w-3xl">
            Drive Something Exceptional
          </h1>
          <p className="text-ivory/70 mt-6 max-w-xl text-lg">
            Curated vehicles and bespoke import services for discerning buyers
            across Kenya.
          </p>
          <div className="flex flex-wrap gap-4 mt-10">
            <Link
              to="/cars"
              className="bg-accent text-charcoal-950 font-medium px-7 py-3.5 rounded-sm hover:bg-accent-light transition-colors"
            >
              Explore Cars
            </Link>
            <Link
              to="/consultation"
              className="border border-ivory/30 px-7 py-3.5 rounded-sm hover:border-accent hover:text-accent transition-colors"
            >
              Request Consultation
            </Link>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="max-w-5xl mx-auto px-5 md:px-8 -mt-16 relative z-10">
        <div className="bg-charcoal-900 border border-charcoal-700 rounded-md p-6 md:p-8 shadow-xl shadow-black/40">
          <h2 className="font-display text-xl mb-5">Find Your Next Car</h2>
          <form
            className="grid grid-cols-2 md:grid-cols-5 gap-4"
            onSubmit={handleSearch}
          >
            <select
              className="input-field"
              value={selectedMake}
              onChange={(e) => setSelectedMake(e.target.value)}
            >
              <option value="">Make</option>
              {makes.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <select
              className="input-field disabled:opacity-40"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={!selectedMake}
            >
              <option value="">
                {selectedMake ? "Model" : "Select a make first"}
              </option>
              {models.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <input
              className="input-field"
              placeholder="Max Price (KES)"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
            <input
              className="input-field"
              placeholder="Min Year"
              value={minYear}
              onChange={(e) => setMinYear(e.target.value)}
            />
            <select
              className="input-field"
              value={bodyType}
              onChange={(e) => setBodyType(e.target.value)}
            >
              <option value="">Body Type</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>

            <button className="col-span-2 md:col-span-5 bg-accent text-charcoal-950 font-medium py-3 rounded-sm hover:bg-accent-light transition-colors">
              Search Vehicles
            </button>
          </form>
        </div>
      </section>

      {/* Featured vehicles */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 mt-24">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-accent text-sm tracking-widest uppercase mb-2">
              Handpicked
            </p>
            <h2 className="font-display text-3xl">Featured Vehicles</h2>
          </div>
          <Link to="/cars" className="text-sm text-accent hover:underline">
            View all cars →
          </Link>
        </div>

        {loading && <LoadingGrid />}
        {error && <ErrorState message={error} />}
        {!loading && !error && featured.length === 0 && (
          <EmptyState message="No featured vehicles yet. Add some from the admin dashboard, or connect the backend to see live data." />
        )}
        {!loading && !error && featured.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 mt-24">
        <h2 className="font-display text-3xl mb-8">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(CATEGORY_ICONS).map(([slug, icon]) => (
            <Link
              key={slug}
              to={`/cars?bodyType=${slug}`}
              className="bg-charcoal-900 border border-charcoal-700 rounded-md p-6 text-center hover:border-accent/60 transition-colors"
            >
              <span className="text-3xl block mb-2">{icon}</span>
              <span className="text-sm capitalize">
                {slug.replace("-", " / ")}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Why choose us */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 mt-24 grid md:grid-cols-3 gap-8">
        {[
          {
            title: "Curated Inventory",
            copy: "Every vehicle is inspected and verified before listing.",
          },
          {
            title: "Import Expertise",
            copy: "End-to-end vehicle importation, handled for you.",
          },
          {
            title: "Personal Consultation",
            copy: "Speak to a specialist — no pressure, just guidance.",
          },
        ].map((item) => (
          <div key={item.title} className="border-l-2 border-accent pl-5">
            <h3 className="font-display text-xl mb-2">{item.title}</h3>
            <p className="text-ivory/60 text-sm">{item.copy}</p>
          </div>
        ))}
      </section>

      {/* Import CTA */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 mt-24">
        <div className="bg-charcoal-900 border border-charcoal-700 rounded-md p-10 md:p-14 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="font-display text-3xl mb-4">
              Can't find it locally?
            </h2>
            <p className="text-ivory/60 mb-6">
              We import vehicles directly to your specification. Tell us what
              you're looking for and we'll handle the rest.
            </p>
            <div className="flex gap-4">
              <Link
                to="/import"
                className="bg-accent text-charcoal-950 font-medium px-6 py-3 rounded-sm"
              >
                Learn About Import
              </Link>
              <Link
                to="/consultation"
                className="border border-ivory/30 px-6 py-3 rounded-sm"
              >
                Find a Car for Me
              </Link>
            </div>
          </div>
          <img
            src="https://images.unsplash.com/photo-1494905998402-395d579af36f?q=80&w=1200"
            alt="Shipping container port representing vehicle import"
            className="rounded-md w-full h-64 object-cover"
          />
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-5 md:px-8 mt-24 mb-24 text-center">
        <h2 className="font-display text-3xl md:text-4xl mb-4">
          Ready to find your next car?
        </h2>
        <p className="text-ivory/60 mb-8">
          Book a free, no-obligation consultation with our team today.
        </p>
        <Link
          to="/consultation"
          className="bg-accent text-charcoal-950 font-medium px-8 py-4 rounded-sm inline-block hover:bg-accent-light transition-colors"
        >
          Request Consultation
        </Link>
      </section>
    </div>
  );
}

function LoadingGrid() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="bg-charcoal-900 border border-charcoal-700 rounded-md h-80 animate-pulse"
        />
      ))}
    </div>
  );
}

export function EmptyState({ message }) {
  return (
    <div className="text-center py-16 border border-dashed border-charcoal-700 rounded-md text-ivory/50">
      {message}
    </div>
  );
}

export function ErrorState({ message }) {
  return (
    <div className="text-center py-16 border border-red-500/30 bg-red-500/5 rounded-md text-red-400">
      Something went wrong: {message}
    </div>
  );
}
