import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminNav() {
  const { admin, logout } = useAuth();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-charcoal-900 border-b border-charcoal-700">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-display text-lg">Admin</span>
          <nav className="flex gap-1">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `text-sm px-3 py-1.5 rounded-sm transition-colors ${
                  isActive
                    ? "bg-accent text-charcoal-950"
                    : "text-ivory/70 hover:text-ivory"
                }`
              }
            >
              Vehicles
            </NavLink>
            <NavLink
              to="/admin/articles"
              className={({ isActive }) =>
                `text-sm px-3 py-1.5 rounded-sm transition-colors ${
                  isActive
                    ? "bg-accent text-charcoal-950"
                    : "text-ivory/70 hover:text-ivory"
                }`
              }
            >
              Content & Articles
            </NavLink>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-ivory/40 hidden sm:inline">
            {admin?.email}
          </span>
          <button
            onClick={logout}
            className="text-sm border border-ivory/30 px-3 py-1.5 rounded-sm hover:border-accent transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
