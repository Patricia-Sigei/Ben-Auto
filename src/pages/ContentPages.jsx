import { useState } from "react";
import { api } from "../lib/api";

// Simple shared layout for the magazine-style content sections.
// These are intentionally lightweight scaffolds - wire them to the Article
// model via api.getArticles({ type: "..." }) once that endpoint is added.
function ContentPage({ eyebrow, title, description, children }) {
  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 pt-32 pb-24">
      <p className="text-accent text-sm tracking-widest uppercase mb-2">{eyebrow}</p>
      <h1 className="font-display text-3xl md:text-4xl mb-4">{title}</h1>
      <p className="text-ivory/60 max-w-2xl mb-12">{description}</p>
      {children || (
        <div className="text-center py-16 border border-dashed border-charcoal-700 rounded-md text-ivory/50">
          Demo placeholder — connect this page to the Article model to show real content.
        </div>
      )}
    </div>
  );
}

export function Reviews() {
  return (
    <ContentPage
      eyebrow="Car Reviews"
      title="In-Depth Vehicle Reviews"
      description="Honest, detailed reviews of the vehicles in our inventory and the wider Kenyan market."
    />
  );
}

export function News() {
  return (
    <ContentPage
      eyebrow="News & Guides"
      title="Automotive News & Buying Guides"
      description="Stay informed with market updates, import guides, and practical car-buying advice."
    />
  );
}

export function Lifestyle() {
  return (
    <ContentPage
      eyebrow="Lifestyle"
      title="Automotive Lifestyle"
      description="Where cars meet culture — stories for the modern Kenyan driver."
    />
  );
}

export function Travel() {
  return (
    <ContentPage
      eyebrow="Travel"
      title="Road Trips & Travel"
      description="Discover Kenya's best drives and destinations, one road trip at a time."
    />
  );
}

export function About() {
  return (
    <ContentPage
      eyebrow="About Us"
      title="About Prestige Motors"
      description="Demo company profile — replace with your real story, mission, and team once available."
    >
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <p className="text-ivory/70 leading-relaxed">
          This is placeholder company content. Prestige Motors (demo) is a concept built to
          showcase a premium car sales and import experience for the Kenyan market. Replace this
          section with your real founding story, values, and team information.
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
          <p>+254 700 000 000</p>
        </div>
        <div className="bg-charcoal-900 border border-charcoal-700 rounded-md p-5">
          <p className="text-ivory/40 mb-1">Email</p>
          <p>info@yourdealership.co.ke</p>
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
  const [form, setForm] = useState({ name: "", phone: "", email: "", make: "", model: "", year: "", mileage: "", condition: "", notes: "" });
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
      <ContentPage eyebrow="Sell or Trade In" title="Request Received" description="">
        <p className="text-ivory/70">Thank you — our team will review your vehicle details and get back to you shortly.</p>
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
          <input required placeholder="Full Name" className="input-field w-full" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input required placeholder="Phone" className="input-field w-full" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <input required type="email" placeholder="Email" className="input-field w-full" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <div className="grid sm:grid-cols-3 gap-4">
          <input required placeholder="Make" className="input-field w-full" value={form.make} onChange={(e) => setForm({ ...form, make: e.target.value })} />
          <input required placeholder="Model" className="input-field w-full" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} />
          <input required type="number" placeholder="Year" className="input-field w-full" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
        </div>
        <input type="number" placeholder="Mileage (km)" className="input-field w-full" value={form.mileage} onChange={(e) => setForm({ ...form, mileage: e.target.value })} />
        <input placeholder="Condition (e.g. Excellent, Good, Fair)" className="input-field w-full" value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })} />
        <textarea rows={4} placeholder="Additional notes" className="input-field w-full" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        <button disabled={status === "submitting"} className="bg-accent text-charcoal-950 font-medium px-8 py-3 rounded-sm disabled:opacity-60">
          {status === "submitting" ? "Submitting..." : "Submit"}
        </button>
      </form>
    </ContentPage>
  );
}
