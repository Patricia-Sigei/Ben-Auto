import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, IMAGE_BASE_URL } from "../../lib/api";
import AdminNav from "./AdminNav";

const emptyForm = {
  make: "",
  model: "",
  year: "",
  price: "",
  mileage: "",
  quantity: "1",
  fuel: "PETROL",
  transmission: "AUTOMATIC",
  engineSize: "",
  exteriorColor: "",
  availability: "AVAILABLE",
  description: "",
  features: "",
  isFeatured: false,
  isNewArrival: false,
  categoryId: "",
};

const CREATE_AVAILABILITY_OPTIONS = [
  { value: "AVAILABLE", label: "Available" },
  { value: "INCOMING", label: "Incoming" },
  { value: "ON_REQUEST", label: "Available on Request" },
];

const EDIT_AVAILABILITY_OPTIONS = [
  { value: "AVAILABLE", label: "Available" },
  { value: "RESERVED", label: "Reserved" },
  { value: "SOLD", label: "Sold Out" },
  { value: "INCOMING", label: "Incoming" },
  { value: "ON_REQUEST", label: "Available on Request" },
];

export default function VehicleForm() {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [categories, setCategories] = useState([]);
  const [stockNumber, setStockNumber] = useState(null); // only known once editing an existing vehicle
  const [newFiles, setNewFiles] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | saving | success | error
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getCategories()
      .then(setCategories)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!isEditing) return;

    api
      .getVehicles({ limit: 200 })
      .then((res) => {
        const found = res.vehicles.find((v) => v.id === id);
        if (found) {
          setForm({
            ...found,
            year: String(found.year),
            price: String(found.price),
            mileage: String(found.mileage),
            quantity: String(found.quantity ?? 1),
            features: (found.features || []).join(", "),
            categoryId: found.categoryId || "",
          });
          setStockNumber(found.stockNumber);
        }
      })
      .catch((err) => setError(err.message));
  }, [id]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("saving");
    setError("");

    const payload = {
      ...form,
      features: form.features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
    };

    try {
      let vehicle;
      if (isEditing) {
        vehicle = await api.updateVehicle(id, payload);
      } else {
        vehicle = await api.createVehicle(payload);
      }

      if (newFiles.length > 0) {
        await api.uploadVehicleImages(vehicle.id, newFiles);
      }

      setStatus("success");
      setTimeout(() => navigate("/admin"), 1200);
    } catch (err) {
      setStatus("error");
      setError(err.message);
    }
  }

  const availabilityOptions = isEditing
    ? EDIT_AVAILABILITY_OPTIONS
    : CREATE_AVAILABILITY_OPTIONS;

  return (
    <>
      <AdminNav />
      <div className="max-w-3xl mx-auto px-5 md:px-8 pt-24 pb-24">
        <h1 className="font-display text-3xl mb-1 mt-8">
          {isEditing ? "Edit Vehicle" : "Post New Vehicle"}
        </h1>
        <p className="text-ivory/50 text-sm mb-8">
          {isEditing
            ? `Stock number ${stockNumber || ""} — assigned automatically and can't be changed.`
            : "A stock number (e.g. DL-004) is assigned automatically once you save."}
        </p>

        {status === "success" && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm rounded-md p-4 mb-6">
            Saved successfully. Redirecting to dashboard...
          </div>
        )}
        {status === "error" && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-md p-4 mb-6">
            Failed to save: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-3 gap-4">
            <TextInput
              label="Make"
              value={form.make}
              onChange={(v) => update("make", v)}
              required
            />
            <TextInput
              label="Model"
              value={form.model}
              onChange={(v) => update("model", v)}
              required
            />
            <TextInput
              label="Year"
              type="number"
              value={form.year}
              onChange={(v) => update("year", v)}
              required
            />
          </div>

          <SelectInput
            label="Category"
            value={form.categoryId}
            onChange={(v) => update("categoryId", v)}
            options={[
              { value: "", label: "None" },
              ...categories.map((c) => ({ value: c.id, label: c.name })),
            ]}
          />

          <div className="grid sm:grid-cols-3 gap-4">
            <TextInput
              label="Price (USD)"
              type="number"
              value={form.price}
              onChange={(v) => update("price", v)}
              required
            />
            <TextInput
              label="Mileage (km)"
              type="number"
              value={form.mileage}
              onChange={(v) => update("mileage", v)}
              required
            />
            <div>
              <TextInput
                label="Quantity in Stock"
                type="number"
                value={form.quantity}
                onChange={(v) => update("quantity", v)}
                required
              />
              <p className="text-xs text-ivory/40 mt-1">
                Units currently available for this listing. Reaches 0 → shows
                "Sold Out".
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <SelectInput
              label="Fuel"
              value={form.fuel}
              onChange={(v) => update("fuel", v)}
              options={["PETROL", "DIESEL", "HYBRID", "ELECTRIC"].map((v) => ({
                value: v,
                label: v,
              }))}
            />
            <SelectInput
              label="Transmission"
              value={form.transmission}
              onChange={(v) => update("transmission", v)}
              options={["AUTOMATIC", "MANUAL"].map((v) => ({
                value: v,
                label: v,
              }))}
            />
            <SelectInput
              label="Status"
              value={form.availability}
              onChange={(v) => update("availability", v)}
              options={availabilityOptions}
            />
          </div>
          {!isEditing && (
            <p className="text-xs text-ivory/40 -mt-3">
              Reserved and Sold Out aren't set here — those are changed later
              from the edit screen once something actually happens.
            </p>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <TextInput
              label="Engine Size (e.g. 2000cc)"
              value={form.engineSize}
              onChange={(v) => update("engineSize", v)}
            />
            <TextInput
              label="Exterior Color"
              value={form.exteriorColor}
              onChange={(v) => update("exteriorColor", v)}
            />
          </div>

          <TextInput
            label="Features (comma-separated)"
            value={form.features}
            onChange={(v) => update("features", v)}
            placeholder="Sunroof, Leather Seats, Reverse Camera"
          />

          <div>
            <label className="block text-sm text-ivory/70 mb-1.5">
              Description
            </label>
            <textarea
              rows={5}
              required
              className="input-field w-full"
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
            />
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => update("isFeatured", e.target.checked)}
              />
              Featured on homepage
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isNewArrival}
                onChange={(e) => update("isNewArrival", e.target.checked)}
              />
              New arrival
            </label>
          </div>

          <div>
            <label className="block text-sm text-ivory/70 mb-1.5">Photos</label>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              // onChange={(e) => {
              //   setNewFiles((prev) => [...prev, ...Array.from(e.target.files)]);
              //   e.target.value = "";
              // }}
              onChange={(e) => setNewFiles(Array.from(e.target.files))}
              className="text-sm text-ivory/60"
            />
            <p className="text-xs text-ivory/40 mt-1">
              {isEditing
                ? "Uploading new photos here adds to existing ones."
                : "Photos upload right after the vehicle is created."}
            </p>
          </div>

          <button
            disabled={status === "saving"}
            className="bg-accent text-charcoal-950 font-medium px-8 py-3 rounded-sm disabled:opacity-60"
          >
            {status === "saving"
              ? "Saving..."
              : isEditing
                ? "Save Changes"
                : "Post Vehicle"}
          </button>
        </form>
      </div>
    </>
  );
}

function TextInput({ label, required, ...props }) {
  return (
    <div>
      <label className="block text-sm text-ivory/70 mb-1.5">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      <input
        required={required}
        className="input-field w-full"
        onChange={(e) => props.onChange(e.target.value)}
        value={props.value}
        type={props.type || "text"}
        placeholder={props.placeholder}
      />
    </div>
  );
}

function SelectInput({ label, options, ...props }) {
  return (
    <div>
      <label className="block text-sm text-ivory/70 mb-1.5">{label}</label>
      <select
        className="input-field w-full"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
