import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import VehicleCard from "../components/VehicleCard";
import { EmptyState, ErrorState } from "./Home";

export default function Cars() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favourites, setFavourites] = useState(() => JSON.parse(localStorage.getItem("favourites") || "[]"));
  const [compareList, setCompareList] = useState(() => JSON.parse(localStorage.getItem("compare") || "[]"));

  const filters = Object.fromEntries(searchParams.entries());

  useEffect(() => {
    setLoading(true);
    setError(null);
    api
      .getVehicles(filters)
      .then((res) => {
        setVehicles(res.vehicles);
        setPagination(res.pagination);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [searchParams.toString()]);

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => {});
  }, []);

  function updateFilter(key, value) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page");
    setSearchParams(next);
  }

  function toggleFavourite(id) {
    setFavourites((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      localStorage.setItem("favourites", JSON.stringify(next));
      return next;
    });
  }

  function toggleCompare(id) {
    setCompareList((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id].slice(-3);
      localStorage.setItem("compare", JSON.stringify(next));
      return next;
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 pt-32 pb-24">
      <h1 className="font-display text-3xl md:text-4xl mb-2">Browse Our Vehicles</h1>
      <p className="text-ivory/60 mb-8">
        {pagination ? `${pagination.total} vehicles found` : "Loading inventory..."}
      </p>

      {/* Filters */}
      <div className="bg-charcoal-900 border border-charcoal-700 rounded-md p-5 mb-8 grid grid-cols-2 md:grid-cols-6 gap-3">
        <input
          className="input-field"
          placeholder="Make"
          defaultValue={filters.make || ""}
          onBlur={(e) => updateFilter("make", e.target.value)}
        />
        <input
          className="input-field"
          placeholder="Model"
          defaultValue={filters.model || ""}
          onBlur={(e) => updateFilter("model", e.target.value)}
        />
        <select className="input-field" value={filters.bodyType || ""} onChange={(e) => updateFilter("bodyType", e.target.value)}>
          <option value="">Body Type</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>
        <select className="input-field" value={filters.fuel || ""} onChange={(e) => updateFilter("fuel", e.target.value)}>
          <option value="">Fuel Type</option>
          <option value="PETROL">Petrol</option>
          <option value="DIESEL">Diesel</option>
          <option value="HYBRID">Hybrid</option>
          <option value="ELECTRIC">Electric</option>
        </select>
        <select className="input-field" value={filters.availability || ""} onChange={(e) => updateFilter("availability", e.target.value)}>
          <option value="">Availability</option>
          <option value="AVAILABLE">Available</option>
          <option value="RESERVED">Reserved</option>
          <option value="INCOMING">Incoming</option>
          <option value="ON_REQUEST">Available on Request</option>
        </select>
        <select className="input-field" value={filters.sort || "newest"} onChange={(e) => updateFilter("sort", e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="mileage_asc">Lowest Mileage</option>
          <option value="year_desc">Newest Year</option>
        </select>
      </div>

      {compareList.length > 0 && (
        <div className="bg-accent/10 border border-accent/30 rounded-md p-4 mb-8 flex items-center justify-between text-sm">
          <span>{compareList.length} vehicle(s) selected to compare</span>
          <button onClick={() => { setCompareList([]); localStorage.setItem("compare", "[]"); }} className="text-accent hover:underline">
            Clear
          </button>
        </div>
      )}

      {loading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-charcoal-900 border border-charcoal-700 rounded-md h-80 animate-pulse" />
          ))}
        </div>
      )}

      {error && <ErrorState message={error} />}

      {!loading && !error && vehicles.length === 0 && (
        <EmptyState message="No vehicles match your search. Try adjusting your filters, or connect the backend and add vehicles from the admin dashboard." />
      )}

      {!loading && !error && vehicles.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((v) => (
            <VehicleCard
              key={v.id}
              vehicle={v}
              onToggleFavourite={toggleFavourite}
              isFavourite={favourites.includes(v.id)}
              onToggleCompare={toggleCompare}
              isComparing={compareList.includes(v.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
