import { Link } from "react-router-dom";
import { whatsappLink } from "./WhatsAppButton";
import { IMAGE_BASE_URL } from "../lib/api";

const AVAILABILITY_STYLES = {
  AVAILABLE: "bg-emerald-500/15 text-emerald-400",
  RESERVED: "bg-amber-500/15 text-amber-400",
  SOLD: "bg-red-500/15 text-red-400",
  INCOMING: "bg-blue-500/15 text-blue-400",
  ON_REQUEST: "bg-accent/15 text-accent",
};

const AVAILABILITY_LABELS = {
  AVAILABLE: "Available",
  RESERVED: "Reserved",
  SOLD: "Sold Out",
  INCOMING: "Incoming",
  ON_REQUEST: "Available on Request",
};

function formatPrice(price) {
  return `KES ${Number(price).toLocaleString()}`;
}

function formatMileage(mileage) {
  return `${Number(mileage).toLocaleString()} km`;
}

export default function VehicleCard({
  vehicle,
  onToggleFavourite,
  isFavourite,
  onToggleCompare,
  isComparing,
}) {
  // Stock automatically overrides the stored status: if quantity has hit
  // zero, the listing shows "Sold Out" regardless of what availability was
  // last set to.
  const isSoldOut = vehicle.quantity !== undefined && vehicle.quantity <= 0;
  const effectiveAvailability = isSoldOut ? "SOLD" : vehicle.availability;

  const primaryImage =
    vehicle.images?.find((i) => i.isPrimary)?.url || vehicle.images?.[0]?.url;
  const imageSrc = primaryImage
    ? primaryImage.startsWith("http")
      ? primaryImage
      : `${IMAGE_BASE_URL}${primaryImage}`
    : "https://placehold.co/600x400/1a1a1d/f4f2ee?text=No+Image";

  const title = `${vehicle.make} ${vehicle.model}`;

  return (
    <div className="group bg-charcoal-900 border border-charcoal-700 rounded-md overflow-hidden hover:border-accent/50 transition-colors">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Link to={`/cars/${vehicle.slug}`}>
          <img
            src={imageSrc}
            alt={`${title} ${vehicle.year}`}
            loading="lazy"
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${isSoldOut ? "grayscale opacity-70" : ""}`}
          />
        </Link>
        <span
          className={`absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-sm ${AVAILABILITY_STYLES[effectiveAvailability]}`}
        >
          {AVAILABILITY_LABELS[effectiveAvailability]}
        </span>
        <button
          onClick={() => onToggleFavourite?.(vehicle.id)}
          aria-label="Toggle favourite"
          aria-pressed={isFavourite}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors ${
            isFavourite
              ? "bg-accent text-charcoal-950"
              : "bg-charcoal-950/60 text-ivory hover:bg-charcoal-950/80"
          }`}
        >
          ♥
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg leading-tight">{title}</h3>
          <span className="text-xs text-ivory/50 whitespace-nowrap pt-1">
            {vehicle.year}
          </span>
        </div>

        <p className="text-accent font-semibold mt-1">
          {formatPrice(vehicle.price)}
        </p>

        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-ivory/60 mt-3">
          <span>{formatMileage(vehicle.mileage)}</span>
          <span>·</span>
          <span className="capitalize">{vehicle.fuel?.toLowerCase()}</span>
          <span>·</span>
          <span className="capitalize">
            {vehicle.transmission?.toLowerCase()}
          </span>
          {!isSoldOut && vehicle.quantity > 1 && (
            <>
              <span>·</span>
              <span className="text-accent">{vehicle.quantity} in stock</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 mt-4">
          <Link
            to={`/cars/${vehicle.slug}`}
            className="flex-1 text-center text-xs font-medium border border-accent text-accent py-2 rounded-sm hover:bg-accent hover:text-charcoal-950 transition-colors"
          >
            View Details
          </Link>
          {!isSoldOut && (
            <a
              href={whatsappLink(
                `Hi, I'm interested in the ${vehicle.year} ${title} (Stock #${vehicle.stockNumber}).`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ask about this vehicle on WhatsApp"
              className="w-9 h-9 flex items-center justify-center rounded-sm bg-[#25D366]/15 text-[#25D366] hover:bg-[#25D366]/25 transition-colors text-sm"
            >
              WA
            </a>
          )}
          <button
            onClick={() => onToggleCompare?.(vehicle.id)}
            aria-pressed={isComparing}
            className={`w-9 h-9 flex items-center justify-center rounded-sm text-xs transition-colors ${
              isComparing
                ? "bg-accent text-charcoal-950"
                : "bg-charcoal-800 text-ivory/70 hover:bg-charcoal-700"
            }`}
            title="Add to compare"
          >
            ⇄
          </button>
        </div>
      </div>
    </div>
  );
}
