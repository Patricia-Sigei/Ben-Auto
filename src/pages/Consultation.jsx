import { useState } from "react";
import { api } from "../lib/api";

const initialState = {
  name: "", phone: "", whatsapp: "", email: "", vehicleOfInterest: "", budget: "", message: "", preferredTime: "",
};

export default function Consultation() {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState("");

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.phone.trim()) errs.phone = "Phone number is required";
    else if (!/^[0-9+\s-]{7,15}$/.test(form.phone)) errs.phone = "Enter a valid phone number";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Enter a valid email address";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setStatus("submitting");
    try {
      await api.submitConsultation(form);
      setStatus("success");
      setForm(initialState);
    } catch (err) {
      setStatus("error");
      setErrorMessage(err.message);
    }
  }

  if (status === "success") {
    return (
      <div className="max-w-xl mx-auto px-5 pt-40 pb-24 text-center">
        <div className="text-5xl mb-4">✓</div>
        <h1 className="font-display text-3xl mb-3">Consultation Requested</h1>
        <p className="text-ivory/60 mb-8">
          Thank you — one of our specialists will reach out to you shortly, usually within a few hours.
        </p>
        <button onClick={() => setStatus("idle")} className="bg-accent text-charcoal-950 px-6 py-3 rounded-sm font-medium">
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-5 pt-32 pb-24">
      <h1 className="font-display text-3xl md:text-4xl mb-2">Request a Consultation</h1>
      <p className="text-ivory/60 mb-8">Tell us a little about what you're looking for and we'll be in touch.</p>

      {status === "error" && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-md p-4 mb-6">
          Something went wrong: {errorMessage}. Please try again.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Field label="Full Name" required error={errors.name}>
          <input className="input-field w-full" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Phone" required error={errors.phone}>
            <input className="input-field w-full" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </Field>
          <Field label="WhatsApp (optional)">
            <input className="input-field w-full" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} />
          </Field>
        </div>
        <Field label="Email" required error={errors.email}>
          <input type="email" className="input-field w-full" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </Field>
        <Field label="Vehicle of Interest">
          <input className="input-field w-full" placeholder="e.g. Toyota Harrier 2024" value={form.vehicleOfInterest} onChange={(e) => setForm({ ...form, vehicleOfInterest: e.target.value })} />
        </Field>
        <Field label="Budget (KES)">
          <input className="input-field w-full" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
        </Field>
        <Field label="Preferred Consultation Time">
          <input className="input-field w-full" placeholder="e.g. Weekday afternoons" value={form.preferredTime} onChange={(e) => setForm({ ...form, preferredTime: e.target.value })} />
        </Field>
        <Field label="Message">
          <textarea rows={4} className="input-field w-full" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        </Field>

        <button disabled={status === "submitting"} className="w-full bg-accent text-charcoal-950 font-medium py-3.5 rounded-sm hover:bg-accent-light transition-colors disabled:opacity-60">
          {status === "submitting" ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
}

function Field({ label, required, error, children }) {
  return (
    <div>
      <label className="block text-sm text-ivory/70 mb-1.5">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      {children}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}
