import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";

const TYPE_LABELS = {
  REVIEW: "Car Review",
  NEWS: "News",
  BUYING_GUIDE: "Buying Guide",
  IMPORT_GUIDE: "Import Guide",
  TIP: "Car Tip",
  LIFESTYLE: "Lifestyle",
  TRAVEL: "Travel",
};

export default function AdminArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState("");

  function load() {
    setLoading(true);
    api
      .getAllArticlesAdmin()
      .then(setArticles)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleDelete(id) {
    if (!confirm("Delete this article? This cannot be undone.")) return;
    await api.deleteArticle(id);
    load();
  }

  const filtered = filterType
    ? articles.filter((a) => a.type === filterType)
    : articles;

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 pt-32 pb-24">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl">Content & Articles</h1>
          <p className="text-ivory/50 text-sm">
            Reviews, News, Guides, Lifestyle, and Travel posts.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/admin"
            className="text-sm border border-ivory/30 px-4 py-2 rounded-sm"
          >
            ← Vehicles
          </Link>
          <Link
            to="/admin/articles/new"
            className="bg-accent text-charcoal-950 text-sm font-medium px-4 py-2 rounded-sm"
          >
            + New Article
          </Link>
        </div>
      </div>

      <select
        className="input-field mb-6"
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
      >
        <option value="">All Types</option>
        {Object.entries(TYPE_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      {loading && <p className="text-ivory/50">Loading articles...</p>}
      {error && <p className="text-red-400">Error: {error}</p>}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-16 border border-dashed border-charcoal-700 rounded-md text-ivory/50">
          No articles yet. Click "+ New Article" to publish your first review,
          guide, or lifestyle post.
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ivory/40 border-b border-charcoal-700">
                <th className="py-3 pr-4">Title</th>
                <th className="py-3 pr-4">Type</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 pr-4">Created</th>
                <th className="py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="border-b border-charcoal-800">
                  <td className="py-3 pr-4">{a.title}</td>
                  <td className="py-3 pr-4 text-ivory/60">
                    {TYPE_LABELS[a.type] || a.type}
                  </td>
                  <td className="py-3 pr-4">
                    {a.published ? "Published" : "Draft"}
                  </td>
                  <td className="py-3 pr-4 text-ivory/60">
                    {new Date(a.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 flex gap-3">
                    <Link
                      to={`/admin/articles/${a.id}/edit`}
                      className="text-accent hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(a.id)}
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
  );
}
