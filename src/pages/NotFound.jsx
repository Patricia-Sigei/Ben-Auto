import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-5">
      <p className="font-display text-8xl text-accent mb-4">404</p>
      <h1 className="font-display text-2xl mb-3">This road leads nowhere</h1>
      <p className="text-ivory/60 mb-8 max-w-sm">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link to="/" className="bg-accent text-charcoal-950 font-medium px-6 py-3 rounded-sm">
        Back to Home
      </Link>
    </div>
  );
}
