import { useState } from "react";

const initialState = {
  name: "",
  phone: "",
  whatsapp: "",
  email: "",
  carModel: "",
  budget: "",
  condition: "",
  fuelType: "",
  consultationDate: "",
  consultationTime: "",
  message: "",
};

export default function Consultation() {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");

  function validate() {
    const errs = {};

    if (!form.name.trim()) {
      errs.name = "Name is required";
    }

    if (!form.phone.trim()) {
      errs.phone = "Phone number is required";
    } else if (!/^[0-9+\s-]{7,15}$/.test(form.phone)) {
      errs.phone = "Enter a valid phone number";
    }

    if (!form.email.trim()) {
      errs.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      errs.email = "Enter a valid email address";
    }

    if (!form.carModel.trim()) {
      errs.carModel = "Please enter the car you are interested in";
    }

    if (!form.budget.trim()) {
      errs.budget = "Please enter your budget";
    }

    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();

    const errs = validate();

    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      return;
    }

    const message = `
🚗 NEW CAR CONSULTATION REQUEST

👤 CUSTOMER DETAILS

Name: ${form.name}
Phone: ${form.phone}
WhatsApp: ${form.whatsapp || "Not provided"}
Email: ${form.email}


🚘 CAR REQUIREMENTS

Car of Interest: ${form.carModel}
Budget: USD ${form.budget}
Condition: ${form.condition || "Not specified"}
Fuel Type: ${form.fuelType || "Not specified"}


📅 CONSULTATION

Date: ${form.consultationDate || "Not specified"}
Time: ${form.consultationTime || "Not specified"}


📝 ADDITIONAL INFORMATION

${form.message || "None"}
`;

    const whatsappUrl = `https://wa.me/254722333058?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank");

    setStatus("success");
    setForm(initialState);
  }

  if (status === "success") {
    return (
      <div className="max-w-xl mx-auto px-5 pt-40 pb-24 text-center">
        <div className="text-5xl mb-4">✓</div>

        <h1 className="font-display text-3xl mb-3">
          Consultation Request Ready
        </h1>

        <p className="text-ivory/60 mb-8">
          Your consultation details have been prepared in WhatsApp. Please send
          the message to complete your request.
        </p>

        <button
          onClick={() => setStatus("idle")}
          className="bg-accent text-charcoal-950 px-6 py-3 rounded-sm font-medium"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-5 pt-32 pb-24">
      <h1 className="font-display text-3xl md:text-4xl mb-2">
        Request a Consultation
      </h1>

      <p className="text-ivory/60 mb-8">
        Tell us a little about the car you're looking for and we'll be in touch.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Field label="Full Name" required error={errors.name}>
          <input
            className="input-field w-full"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
          />
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Phone" required error={errors.phone}>
            <input
              className="input-field w-full"
              placeholder="+254..."
              value={form.phone}
              onChange={(e) =>
                setForm({
                  ...form,
                  phone: e.target.value,
                })
              }
            />
          </Field>

          <Field label="WhatsApp Number">
            <input
              className="input-field w-full"
              placeholder="+254..."
              value={form.whatsapp}
              onChange={(e) =>
                setForm({
                  ...form,
                  whatsapp: e.target.value,
                })
              }
            />
          </Field>
        </div>

        <Field label="Email" required error={errors.email}>
          <input
            type="email"
            className="input-field w-full"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
          />
        </Field>

        <Field label="Car of Interest" required error={errors.carModel}>
          <input
            className="input-field w-full"
            placeholder="e.g. Toyota Harrier 2024"
            value={form.carModel}
            onChange={(e) =>
              setForm({
                ...form,
                carModel: e.target.value,
              })
            }
          />
        </Field>

        <Field label="Budget (USD)" required error={errors.budget}>
          <input
            type="number"
            className="input-field w-full"
            placeholder="e.g. 3500000"
            value={form.budget}
            onChange={(e) =>
              setForm({
                ...form,
                budget: e.target.value,
              })
            }
          />
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Condition">
            <select
              className="input-field w-full"
              value={form.condition}
              onChange={(e) =>
                setForm({
                  ...form,
                  condition: e.target.value,
                })
              }
            >
              <option value="">Select condition</option>
              <option value="New">New</option>
              <option value="Used">Used</option>
              <option value="Either">Either</option>
            </select>
          </Field>

          <Field label="Fuel Type">
            <select
              className="input-field w-full"
              value={form.fuelType}
              onChange={(e) =>
                setForm({
                  ...form,
                  fuelType: e.target.value,
                })
              }
            >
              <option value="">Select fuel type</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Electric">Electric</option>
              <option value="No Preference">No Preference</option>
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Consultation Date">
            <input
              type="date"
              className="input-field w-full"
              min={new Date().toISOString().split("T")[0]}
              value={form.consultationDate}
              onChange={(e) =>
                setForm({
                  ...form,
                  consultationDate: e.target.value,
                })
              }
            />
          </Field>

          <Field label="Preferred Consultation Time">
            <input
              type="time"
              className="input-field w-full"
              value={form.consultationTime}
              onChange={(e) =>
                setForm({
                  ...form,
                  consultationTime: e.target.value,
                })
              }
            />
          </Field>
        </div>

        <Field label="Additional Information">
          <textarea
            rows={4}
            className="input-field w-full"
            placeholder="Tell us anything else that may help us prepare for your consultation."
            value={form.message}
            onChange={(e) =>
              setForm({
                ...form,
                message: e.target.value,
              })
            }
          />
        </Field>

        <button
          type="submit"
          className="w-full bg-accent text-charcoal-950 font-medium py-3.5 rounded-sm hover:bg-accent-light transition-colors"
        >
          Submit Request
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
