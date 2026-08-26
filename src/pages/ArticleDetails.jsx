import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../lib/api";
import { ErrorState } from "./Home";

export default function ArticleDetails() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    api
      .getArticleBySlug(slug)
      .then(setArticle)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading)
    return (
      <div className="max-w-3xl mx-auto px-5 pt-40 pb-24 animate-pulse text-ivory/50">
        Loading article...
      </div>
    );
  if (error)
    return (
      <div className="max-w-3xl mx-auto px-5 pt-40 pb-24">
        <ErrorState message={error} />
      </div>
    );
  if (!article) return null;

  return (
    <article className="max-w-3xl mx-auto px-5 md:px-8 pt-32 pb-24">
      <Link to="/news" className="text-accent text-sm hover:underline">
        ← Back
      </Link>
      {article.coverImage && (
        <img
          src={article.coverImage}
          alt={article.title}
          className="w-full h-72 object-cover rounded-md my-6"
        />
      )}
      <h1 className="font-display text-3xl md:text-4xl mb-4">
        {article.title}
      </h1>
      <p className="text-ivory/50 text-sm mb-8">
        {new Date(article.createdAt).toLocaleDateString()}
      </p>
      <div className="text-ivory/80 leading-relaxed whitespace-pre-line">
        {article.content}
      </div>
    </article>
  );
}
