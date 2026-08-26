import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";
import AdminNav from "./AdminNav";

export default function AdminDashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function load() {
    setLoading(true);
    api
      .getVehicles({ limit: 100 })
      .then((res) => setVehicles(res.vehicles))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleDelete(id) {
    if (!confirm("Delete this vehicle listing? This cannot be undone.")) return;
    await api.deleteVehicle(id);
    load();
  }

  return (
    <>
      <AdminNav />
      <div className="max-w-6xl mx-auto px-5 md:px-8 pt-24 pb-24">
        <div className="flex items-center justify-between mb-8 mt-8">
          <h1 className="font-display text-3xl">Vehicles</h1>
          <Link
            to="/admin/vehicles/new"
            className="bg-accent text-charcoal-950 text-sm font-medium px-4 py-2 rounded-sm"
          >
            + Post New Vehicle
          </Link>
        </div>

        {loading && <p className="text-ivory/50">Loading vehicles...</p>}
        {error && <p className="text-red-400">Error: {error}</p>}

        {!loading && !error && vehicles.length === 0 && (
          <div className="text-center py-16 border border-dashed border-charcoal-700 rounded-md text-ivory/50">
            No vehicles posted yet. Click "Post New Vehicle" to add your first
            listing.
          </div>
        )}

        {!loading && vehicles.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-ivory/40 border-b border-charcoal-700">
                  <th className="py-3 pr-4">Vehicle</th>
                  <th className="py-3 pr-4">Stock #</th>
                  <th className="py-3 pr-4">Price</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3 pr-4">Images</th>
                  <th className="py-3"></th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((v) => (
                  <tr key={v.id} className="border-b border-charcoal-800">
                    <td className="py-3 pr-4">
                      {v.year} {v.make} {v.model}
                    </td>
                    <td className="py-3 pr-4 text-ivory/60">{v.stockNumber}</td>
                    <td className="py-3 pr-4">
                      KES {v.price.toLocaleString()}
                    </td>
                    <td className="py-3 pr-4 capitalize">
                      {v.availability.toLowerCase().replace("_", " ")}
                    </td>
                    <td className="py-3 pr-4">{v.images?.length || 0}</td>
                    <td className="py-3 flex gap-3">
                      <Link
                        to={`/admin/vehicles/${v.id}/edit`}
                        className="text-accent hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(v.id)}
                        className="text-red-400 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
