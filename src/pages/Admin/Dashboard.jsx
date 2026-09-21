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

  async function handleSellOne(v) {
    if (v.quantity <= 0) return;
    const label =
      v.quantity === 1
        ? "This will mark it as Sold Out."
        : `This will reduce stock from ${v.quantity} to ${v.quantity - 1}.`;
    if (
      !confirm(
        `Mark one unit of ${v.year} ${v.make} ${v.model} as sold? ${label}`,
      )
    )
      return;
    await api.sellOneUnit(v.id);
    load();
  }

  const totalUnitsInStock = vehicles.reduce(
    (sum, v) => sum + (v.quantity ?? 1),
    0,
  );
  const soldOutCount = vehicles.filter((v) => (v.quantity ?? 1) <= 0).length;

  return (
    <>
      <AdminNav />
      <div className="max-w-6xl mx-auto px-5 md:px-8 pt-24 pb-24">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 mt-8">
          <h1 className="font-display text-3xl">Vehicles</h1>
          <Link
            to="/admin/vehicles/new"
            className="bg-accent text-charcoal-950 text-sm font-medium px-4 py-2 rounded-sm"
          >
            + Post New Vehicle
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatCard label="Listings" value={vehicles.length} />
          <StatCard label="Total Units in Stock" value={totalUnitsInStock} />
          <StatCard label="Sold Out Listings" value={soldOutCount} />
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
                  <th className="py-3 pr-4">Stock </th>
                  <th className="py-3 pr-4">Price</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3 pr-4">Qty</th>
                  <th className="py-3"></th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((v) => {
                  const quantity = v.quantity ?? 1;
                  const isSoldOut = quantity <= 0;
                  return (
                    <tr key={v.id} className="border-b border-charcoal-800">
                      <td className="py-3 pr-4">
                        {v.year} {v.make} {v.model}
                      </td>
                      <td className="py-3 pr-4 text-ivory/60">
                        {v.stockNumber}
                      </td>
                      <td className="py-3 pr-4">
                        KES {v.price.toLocaleString()}
                      </td>
                      <td className="py-3 pr-4">
                        {isSoldOut ? (
                          <span className="text-red-400">Sold Out</span>
                        ) : (
                          <span className="capitalize">
                            {v.availability.toLowerCase().replace("_", " ")}
                          </span>
                        )}
                      </td>
                      <td className="py-3 pr-4">{quantity}</td>
                      <td className="py-3 flex gap-3">
                        <Link
                          to={`/admin/vehicles/${v.id}/edit`}
                          className="text-accent hover:underline"
                        >
                          Edit
                        </Link>
                        {!isSoldOut && (
                          <button
                            onClick={() => handleSellOne(v)}
                            className="text-amber-400 hover:underline"
                          >
                            Mark One Sold
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(v.id)}
                          className="text-red-400 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-charcoal-900 border border-charcoal-700 rounded-md p-4">
      <p className="text-ivory/40 text-xs uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className="font-display text-2xl">{value}</p>
    </div>
  );
}
