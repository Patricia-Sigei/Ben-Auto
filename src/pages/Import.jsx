import { useState } from "react";
import { Link } from "react-router-dom";

const STEPS = [
  {
    title: "Consultation",
    copy: "Tell us the make, model, and spec you want.",
  },
  {
    title: "Sourcing",
    copy: "We locate and verify the vehicle at auction or from a trusted dealer.",
  },
  {
    title: "Purchase & Shipping",
    copy: "We handle purchase, inspection, and shipping to Mombasa.",
  },
  {
    title: "Clearing & Registration",
    copy: "We manage customs clearance, duty payment, and KRA/NTSA registration.",
  },
  {
    title: "Delivery",
    copy: "Your vehicle is delivered to you, fully registered and ready to drive.",
  },
];

function estimateImportCost(cif, engineCc) {
  const dutyRate = 0.25;
  const exciseRate = engineCc > 2500 ? 0.35 : engineCc > 1500 ? 0.25 : 0.2;
  const vatRate = 0.16;

  const duty = cif * dutyRate;
  const excise = (cif + duty) * exciseRate;
  const vat = (cif + duty + excise) * vatRate;
  const idfFee = cif * 0.02;
  const rdlFee = cif * 0.02;

  const total = duty + excise + vat + idfFee + rdlFee;
  return { duty, excise, vat, idfFee, rdlFee, total, grandTotal: cif + total };
}

export default function Import() {
  const [cif, setCif] = useState("");
  const [engineCc, setEngineCc] = useState("");
  const [result, setResult] = useState(null);

  function handleCalculate(e) {
    e.preventDefault();
    if (!cif || !engineCc) return;
    setResult(estimateImportCost(Number(cif), Number(engineCc)));
  }

  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 pt-32 pb-24">
      <h1 className="font-display text-3xl md:text-4xl mb-3">
        Import a Vehicle
      </h1>
      <p className="text-ivory/60 max-w-2xl mb-14">
        We manage the entire import process end-to-end — sourcing, shipping,
        clearing, and registration — so you don't have to navigate it alone.
      </p>

      <div className="grid md:grid-cols-5 gap-6 mb-20">
        {STEPS.map((step, i) => (
          <div
            key={step.title}
            className="bg-charcoal-900 border border-charcoal-700 rounded-md p-5"
          >
            <span className="text-accent font-display text-2xl">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="font-medium mt-3 mb-1">{step.title}</h3>
            <p className="text-xs text-ivory/60">{step.copy}</p>
          </div>
        ))}
      </div>

      {/* Calculator */}
      <div className="bg-charcoal-900 border border-charcoal-700 rounded-md p-6 md:p-10">
        <h2 className="font-display text-2xl mb-2">Import Cost Calculator</h2>
        <p className="text-ivory/50 text-sm mb-6">
          Rough estimate only — actual duty depends on CRSP value, engine size,
          vehicle age, and current KRA rates. Speak to our team for an accurate
          quote.
        </p>

        <form
          onSubmit={handleCalculate}
          className="grid sm:grid-cols-3 gap-4 mb-6"
        >
          <div>
            <label className="block text-sm text-ivory/70 mb-1.5">
              CIF Value (KES)
            </label>
            <input
              className="input-field w-full"
              type="number"
              value={cif}
              onChange={(e) => setCif(e.target.value)}
              placeholder="e.g. 1500"
            />
          </div>
          <div>
            <label className="block text-sm text-ivory/70 mb-1.5">
              Engine Size (cc)
            </label>
            <input
              className="input-field w-full"
              type="number"
              value={engineCc}
              onChange={(e) => setEngineCc(e.target.value)}
              placeholder="e.g. 2000"
            />
          </div>
          <div className="flex items-end">
            <button className="w-full bg-accent text-charcoal-950 font-medium py-2.5 rounded-sm">
              Calculate
            </button>
          </div>
        </form>

        {result && (
          <div className="border-t border-charcoal-700 pt-6 grid sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <Row label="Import Duty (25%)" value={result.duty} />
            <Row label="Excise Duty" value={result.excise} />
            <Row label="VAT (16%)" value={result.vat} />
            <Row label="IDF Fee (2%)" value={result.idfFee} />
            <Row label="RDL Fee (2%)" value={result.rdlFee} />
            <Row label="Total Taxes & Fees" value={result.total} bold />
            <Row
              label="Estimated Total Landed Cost"
              value={result.grandTotal}
              bold
              accent
            />
          </div>
        )}

        <p className="text-xs text-ivory/40 mt-6">
          Disclaimer: This calculator provides an illustrative estimate for
          planning purposes only and is not a formal quotation. Final costs are
          confirmed after vehicle inspection and KRA valuation.
        </p>
      </div>

      <div className="text-center mt-16">
        <Link
          to="/consultation"
          className="bg-accent text-charcoal-950 font-medium px-8 py-3.5 rounded-sm inline-block"
        >
          Start Your Import Request
        </Link>
      </div>
    </div>
  );
}

function Row({ label, value, bold, accent }) {
  return (
    <div
      className={`flex justify-between ${bold ? "font-semibold" : ""} ${accent ? "text-accent" : "text-ivory/80"}`}
    >
      <span>{label}</span>
      <span>USD {Math.round(value).toLocaleString()}</span>
    </div>
  );
}
