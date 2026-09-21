import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api, IMAGE_BASE_URL } from "../lib/api";
import { EmptyState, ErrorState } from "./Home";

// Shared layout for the magazine-style content sections. Pass `types`
// (matching the Prisma Article.type enum) to fetch + render real articles,
// or pass `children` for static content pages like About/Contact that don't
// pull from the Article model.
function ContentPage({ eyebrow, title, description, types, children }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(!!types);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!types) return; // static page (About, Contact, etc.) - nothing to fetch
    setLoading(true);
    Promise.all(types.map((type) => api.getArticles({ type })))
      .then((results) => setArticles(results.flat()))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [types?.join(",")]);

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 pt-32 pb-24">
      <p className="text-accent text-sm tracking-widest uppercase mb-2">
        {eyebrow}
      </p>
      <h1 className="font-display text-3xl md:text-4xl mb-4">{title}</h1>
      <p className="text-ivory/60 max-w-2xl mb-12">{description}</p>

      {children}

      {types && loading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-charcoal-900 border border-charcoal-700 rounded-md h-64 animate-pulse"
            />
          ))}
        </div>
      )}

      {types && error && <ErrorState message={error} />}

      {types && !loading && !error && articles.length === 0 && (
        <EmptyState message="No articles published yet. Post one from the admin dashboard under Content & Articles." />
      )}

      {types && !loading && !error && articles.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((a) => {
            const coverUrl = a.coverImage
              ? a.coverImage.startsWith("http")
                ? a.coverImage
                : `${IMAGE_BASE_URL}${a.coverImage}`
              : null;
            return (
              <Link
                key={a.id}
                to={`/articles/${a.slug}`}
                className="bg-charcoal-900 border border-charcoal-700 rounded-md overflow-hidden hover:border-accent/50 transition-colors group"
              >
                {coverUrl ? (
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={coverUrl}
                      alt={a.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="aspect-[16/10] bg-charcoal-800 flex items-center justify-center text-ivory/20 text-sm">
                    No image
                  </div>
                )}
                <div className="p-5">
                  <h3 className="font-display text-lg mb-2 leading-snug">
                    {a.title}
                  </h3>
                  <p className="text-ivory/60 text-sm line-clamp-2">
                    {a.excerpt}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function Reviews() {
  return (
    <ContentPage
      eyebrow="Car Reviews"
      title="Vehicle Reviews for the Kenyan Market"
      description="Honest, in-depth reviews covering performance, reliability, fuel economy, and value — helping you choose the right car for Kenyan roads and driving conditions."
      types={["REVIEW"]}
    />
  );
}

export function News() {
  return (
    <ContentPage
      eyebrow="News & Guides"
      title="Automotive News & Buying Guides for Kenya"
      description="Stay ahead with Kenyan car market updates, step-by-step import guides, and practical buying advice — from choosing the right model to navigating KRA duty and registration."
      types={["NEWS", "BUYING_GUIDE", "IMPORT_GUIDE", "TIP"]}
    />
  );
}

export function Lifestyle() {
  return (
    <ContentPage
      eyebrow="Lifestyle"
      title="Automotive Lifestyle in Kenya"
      description="Car culture, ownership tips, and stories for the modern Kenyan driver — from maintenance advice to the trends shaping how we drive."
      types={["LIFESTYLE"]}
    />
  );
}

export function Travel() {
  return (
    <ContentPage
      eyebrow="Travel"
      title="Road Trips & Travel Guides"
      description="Explore Kenya's best road trip routes, scenic drives, and travel destinations — plus practical tips on choosing the right vehicle for every journey."
      types={["TRAVEL"]}
    />
  );
}

export function About() {
  return (
    <ContentPage
      eyebrow="About Us"
      title="About DriveLux Imports"
      description="Kenya's trusted partner for premium car sales and vehicle imports — from sourcing to delivery."
    >
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <p className="text-ivory/70 leading-relaxed">
          DriveLux Imports is Kenya's trusted partner for premium car sales and
          vehicle import services, connecting buyers across Nairobi and beyond
          with quality vehicles sourced locally and internationally. Since 2024,
          we've helped clients navigate everything from selecting the right SUV
          for their family to importing a specific model from Japan, the UK, or
          South Africa. We handle inspection, shipping, customs clearance, and
          KRA registration every step of the way. We believe buying or importing
          a car shouldn't feel like a gamble: every vehicle in our inventory is
          inspected before listing, every import is tracked from purchase to
          delivery, and every client gets a dedicated point of contact.
        </p>
        <img
          src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1000"
          alt="Showroom placeholder"
          className="rounded-md w-full h-72 object-cover"
        />
      </div>
    </ContentPage>
  );
}

export function Contact() {
  return (
    <ContentPage
      eyebrow="Contact"
      title="Get in Touch"
      description="Reach out with any questions — we typically respond within a few hours."
    >
      <div className="grid sm:grid-cols-3 gap-6 text-sm">
        <div className="bg-charcoal-900 border border-charcoal-700 rounded-md p-5">
          <p className="text-ivory/40 mb-1">Phone</p>
          <p>+254 722333058</p>
        </div>
        <div className="bg-charcoal-900 border border-charcoal-700 rounded-md p-5">
          <p className="text-ivory/40 mb-1">Email</p>
          <p>info@DriveLuximports.co.ke</p>
        </div>
        <div className="bg-charcoal-900 border border-charcoal-700 rounded-md p-5">
          <p className="text-ivory/40 mb-1">Location</p>
          <p>Nairobi, Kenya</p>
        </div>
      </div>
    </ContentPage>
  );
}

export function SellTradeIn() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    make: "",
    model: "",
    year: "",
    mileage: "",
    condition: "",
    notes: "",
  });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");
    try {
      await api.submitTradeInRequest(form);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err.message);
    }
  }

  if (status === "success") {
    return (
      <ContentPage
        eyebrow="Sell or Trade In"
        title="Request Received"
        description=""
      >
        <p className="text-ivory/70">
          Thank you — our team will review your vehicle details and get back to
          you shortly.
        </p>
      </ContentPage>
    );
  }

  return (
    <ContentPage
      eyebrow="Sell or Trade In"
      title="Sell or Trade In Your Car"
      description="Tell us about your current vehicle and we'll get back to you with an offer or trade-in valuation."
    >
      {status === "error" && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-md p-4 mb-6">
          Something went wrong: {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <input
            required
            placeholder="Full Name"
            className="input-field w-full"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            required
            placeholder="Phone"
            className="input-field w-full"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>
        <input
          required
          type="email"
          placeholder="Email"
          className="input-field w-full"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <div className="grid sm:grid-cols-3 gap-4">
          <input
            required
            placeholder="Make"
            className="input-field w-full"
            value={form.make}
            onChange={(e) => setForm({ ...form, make: e.target.value })}
          />
          <input
            required
            placeholder="Model"
            className="input-field w-full"
            value={form.model}
            onChange={(e) => setForm({ ...form, model: e.target.value })}
          />
          <input
            required
            type="number"
            placeholder="Year"
            className="input-field w-full"
            value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })}
          />
        </div>
        <input
          type="number"
          placeholder="Mileage (km)"
          className="input-field w-full"
          value={form.mileage}
          onChange={(e) => setForm({ ...form, mileage: e.target.value })}
        />
        <input
          placeholder="Condition (e.g. Excellent, Good, Fair)"
          className="input-field w-full"
          value={form.condition}
          onChange={(e) => setForm({ ...form, condition: e.target.value })}
        />
        <textarea
          rows={4}
          placeholder="Additional notes"
          className="input-field w-full"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
        <button
          disabled={status === "submitting"}
          className="bg-accent text-charcoal-950 font-medium px-8 py-3 rounded-sm disabled:opacity-60"
        >
          {status === "submitting" ? "Submitting..." : "Submit"}
        </button>
      </form>
    </ContentPage>
  );
}
