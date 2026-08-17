import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api, IMAGE_BASE_URL } from "../lib/api";
import { whatsappLink } from "../components/WhatsAppButton";
import { ErrorState } from "./Home";

export default function CarDetails() {
  const { slug } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavourite, setIsFavourite] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .getVehicleBySlug(slug)
      .then((v) => {
        setVehicle(v);
        const favs = JSON.parse(localStorage.getItem("favourites") || "[]");
        setIsFavourite(favs.includes(v.id));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  function toggleFavourite() {
    const favs = JSON.parse(localStorage.getItem("favourites") || "[]");
    const next = favs.includes(vehicle.id) ? favs.filter((f) => f !== vehicle.id) : [...favs, vehicle.id];
    localStorage.setItem("favourites", JSON.stringify(next));
    setIsFavourite(!isFavourite);
  }

  function share() {
    if (navigator.share) {
      navigator.share({ title: `${vehicle.make} ${vehicle.model}`, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard");
    }
  }

  if (loading) {
    return <div className="max-w-7xl mx-auto px-5 md:px-8 pt-40 pb-24 animate-pulse text-ivory/50">Loading vehicle...</div>;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-5 md:px-8 pt-40 pb-24">
        <ErrorState message={error} />
      </div>
    );
  }

  if (!vehicle) return null;

  const images = vehicle.images?.length
    ? vehicle.images
    : [{ url: "https://placehold.co/1200x800/1a1a1d/f4f2ee?text=No+Image" }];

  const resolvedImage = (url) => (url.startsWith("http") ? url : `${IMAGE_BASE_URL}${url}`);

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 pt-32 pb-24">
      <div className="grid lg:grid-cols-2 gap-10">
        {/* Gallery */}
        <div>
          <div className="aspect-[4/3] rounded-md overflow-hidden bg-charcoal-900">
            <img src={resolvedImage(images[activeImage].url)} alt={`${vehicle.make} ${vehicle.model}`} className="w-full h-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 mt-3 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button
                  key={img.id || i}
                  onClick={() => setActiveImage(i)}
                  className={`w-20 h-16 flex-shrink-0 rounded-sm overflow-hidden border-2 ${
                    activeImage === i ? "border-accent" : "border-transparent"
                  }`}
                >
                  <img src={resolvedImage(img.url)} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-accent text-sm tracking-widest uppercase mb-2">Stock #{vehicle.stockNumber}</p>
          <h1 className="font-display text-3xl md:text-4xl mb-3">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h1>
          <p className="text-3xl font-semibold text-accent mb-6">KES {vehicle.price.toLocaleString()}</p>

          <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
            <Spec label="Mileage" value={`${vehicle.mileage.toLocaleString()} km`} />
            <Spec label="Engine" value={vehicle.engineSize || "—"} />
            <Spec label="Fuel" value={vehicle.fuel} />
            <Spec label="Transmission" value={vehicle.transmission} />
            <Spec label="Exterior" value={vehicle.exteriorColor || "—"} />
            <Spec label="Availability" value={vehicle.availability.replace("_", " ")} />
          </div>

          <div className="flex flex-wrap gap-3 mb-8">
            <a
              href={whatsappLink(`Hi, I'm interested in the ${vehicle.year} ${vehicle.make} ${vehicle.model} (Stock #${vehicle.stockNumber}).`)}
              target="_blank" rel="noopener noreferrer"
              className="bg-[#25D366] text-charcoal-950 font-medium px-5 py-3 rounded-sm text-sm"
            >
              Chat on WhatsApp
            </a>
            <Link to="/consultation" className="bg-accent text-charcoal-950 font-medium px-5 py-3 rounded-sm text-sm">
              Request Consultation
            </Link>
            <Link to="/consultation" className="border border-ivory/30 px-5 py-3 rounded-sm text-sm">
              Schedule Viewing
            </Link>
            <button onClick={toggleFavourite} className={`border px-4 py-3 rounded-sm text-sm ${isFavourite ? "border-accent text-accent" : "border-ivory/30"}`}>
              {isFavourite ? "♥ Saved" : "♡ Favourite"}
            </button>
            <button onClick={share} className="border border-ivory/30 px-4 py-3 rounded-sm text-sm">Share</button>
          </div>

          {vehicle.features?.length > 0 && (
            <div className="mb-8">
              <h2 className="font-display text-xl mb-3">Features</h2>
              <div className="flex flex-wrap gap-2">
                {vehicle.features.map((f) => (
                  <span key={f} className="text-xs bg-charcoal-800 border border-charcoal-600 px-3 py-1.5 rounded-full text-ivory/70">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="font-display text-xl mb-3">Description</h2>
            <p className="text-ivory/70 text-sm leading-relaxed">{vehicle.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Spec({ label, value }) {
  return (
    <div className="border-b border-charcoal-700 pb-2">
      <p className="text-ivory/40 text-xs uppercase tracking-wide">{label}</p>
      <p className="capitalize mt-0.5">{value?.toLowerCase?.() || value}</p>
    </div>
  );
}
