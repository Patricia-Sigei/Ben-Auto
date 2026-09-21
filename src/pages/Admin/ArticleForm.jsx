// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { api, IMAGE_BASE_URL } from "../../lib/api";
// import AdminNav from "./AdminNav";

// const TYPES = [
//   { value: "REVIEW", label: "Car Review" },
//   { value: "NEWS", label: "News" },
//   { value: "BUYING_GUIDE", label: "Buying Guide" },
//   { value: "IMPORT_GUIDE", label: "Import Guide" },
//   { value: "TIP", label: "Car Tip" },
//   { value: "LIFESTYLE", label: "Lifestyle" },
//   { value: "TRAVEL", label: "Travel" },
// ];

// const emptyForm = {
//   title: "",
//   type: "REVIEW",
//   excerpt: "",
//   content: "",
//   coverImage: "",
//   published: true,
// };

// export default function ArticleForm() {
//   const { id } = useParams();
//   const isEditing = !!id;
//   const navigate = useNavigate();

//   const [form, setForm] = useState(emptyForm);
//   const [coverFile, setCoverFile] = useState(null);
//   const [coverPreview, setCoverPreview] = useState(null);
//   const [status, setStatus] = useState("idle"); // idle | loading | saving | success | error
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (!isEditing) return;
//     setStatus("loading");
//     // Admin "get all" is reused here to find the one being edited, avoiding
//     // the need for a separate get-by-id admin route.
//     api
//       .getAllArticlesAdmin()
//       .then((articles) => {
//         const found = articles.find((a) => a.id === id);
//         if (found) setForm(found);
//         setStatus("idle");
//       })
//       .catch((err) => {
//         setError(err.message);
//         setStatus("error");
//       });
//   }, [id]);

//   function update(field, value) {
//     setForm((f) => ({ ...f, [field]: value }));
//   }

//   function handleCoverFileChange(e) {
//     const file = e.target.files[0];
//     if (!file) return;
//     setCoverFile(file);
//     setCoverPreview(URL.createObjectURL(file));
//   }

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setStatus("saving");
//     setError("");
//     try {
//       let article;
//       if (isEditing) {
//         article = await api.updateArticle(id, form);
//       } else {
//         article = await api.createArticle(form);
//       }

//       if (coverFile) {
//         await api.uploadArticleCoverImage(article.id, coverFile);
//       }

//       setStatus("success");
//       setTimeout(() => navigate("/admin/articles"), 1000);
//     } catch (err) {
//       setStatus("error");
//       setError(err.message);
//     }
//   }

//   const existingCoverUrl = form.coverImage
//     ? form.coverImage.startsWith("http")
//       ? form.coverImage
//       : `${IMAGE_BASE_URL}${form.coverImage}`
//     : null;

//   return (
//     <>
//       <AdminNav />
//       <div className="max-w-3xl mx-auto px-5 md:px-8 pt-24 pb-24">
//         <h1 className="font-display text-3xl mb-1 mt-8">
//           {isEditing ? "Edit Article" : "New Article"}
//         </h1>
//         <p className="text-ivory/50 text-sm mb-8">
//           Used for Reviews, News, Guides, Lifestyle, and Travel content across
//           the site.
//         </p>

//         {status === "success" && (
//           <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm rounded-md p-4 mb-6">
//             Saved. Redirecting...
//           </div>
//         )}
//         {status === "error" && (
//           <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-md p-4 mb-6">
//             Failed to save: {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div>
//             <label className="block text-sm text-ivory/70 mb-1.5">Title</label>
//             <input
//               required
//               className="input-field w-full"
//               value={form.title}
//               onChange={(e) => update("title", e.target.value)}
//             />
//           </div>

//           <div>
//             <label className="block text-sm text-ivory/70 mb-1.5">
//               Content Type
//             </label>
//             <select
//               className="input-field w-full"
//               value={form.type}
//               onChange={(e) => update("type", e.target.value)}
//             >
//               {TYPES.map((t) => (
//                 <option key={t.value} value={t.value}>
//                   {t.label}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm text-ivory/70 mb-1.5">
//               Cover Photo
//             </label>
//             {(coverPreview || existingCoverUrl) && (
//               <img
//                 src={coverPreview || existingCoverUrl}
//                 alt="Cover preview"
//                 className="w-full h-48 object-cover rounded-md mb-3 border border-charcoal-700"
//               />
//             )}
//             <input
//               type="file"
//               accept="image/jpeg,image/png,image/webp"
//               onChange={handleCoverFileChange}
//               className="text-sm text-ivory/60"
//             />
//             <p className="text-xs text-ivory/40 mt-1">
//               {isEditing
//                 ? "Choose a new photo to replace the current cover."
//                 : "The photo uploads right after you publish."}
//             </p>
//           </div>

//           <div>
//             <label className="block text-sm text-ivory/70 mb-1.5">
//               Excerpt (short summary shown in listings)
//             </label>
//             <textarea
//               required
//               rows={2}
//               className="input-field w-full"
//               value={form.excerpt}
//               onChange={(e) => update("excerpt", e.target.value)}
//             />
//           </div>

//           <div>
//             <label className="block text-sm text-ivory/70 mb-1.5">
//               Full Content
//             </label>
//             <textarea
//               required
//               rows={10}
//               className="input-field w-full"
//               value={form.content}
//               onChange={(e) => update("content", e.target.value)}
//             />
//           </div>

//           <label className="flex items-center gap-2 text-sm">
//             <input
//               type="checkbox"
//               checked={form.published}
//               onChange={(e) => update("published", e.target.checked)}
//             />
//             Published (visible on the site)
//           </label>

//           <button
//             disabled={status === "saving"}
//             className="bg-accent text-charcoal-950 font-medium px-8 py-3 rounded-sm disabled:opacity-60"
//           >
//             {status === "saving"
//               ? "Saving..."
//               : isEditing
//                 ? "Save Changes"
//                 : "Publish Article"}
//           </button>
//         </form>
//       </div>
//     </>
//   );
// }

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, IMAGE_BASE_URL } from "../../lib/api";
import AdminNav from "./AdminNav";

const TYPES = [
  { value: "REVIEW", label: "Car Review" },
  { value: "NEWS", label: "News" },
  { value: "BUYING_GUIDE", label: "Buying Guide" },
  { value: "IMPORT_GUIDE", label: "Import Guide" },
  { value: "TIP", label: "Car Tip" },
  { value: "LIFESTYLE", label: "Lifestyle" },
  { value: "TRAVEL", label: "Travel" },
];

const emptyForm = {
  title: "",
  type: "REVIEW",
  excerpt: "",
  content: "",
  coverImage: "",
  published: true,
};

export default function ArticleForm() {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditing) return;

    setStatus("loading");

    api
      .getAllArticlesAdmin()
      .then((articles) => {
        const found = articles.find((article) => article.id === id);

        if (found) {
          setForm(found);
        }

        setStatus("idle");
      })
      .catch((err) => {
        setError(err.message);
        setStatus("error");
      });
  }, [id, isEditing]);

  function update(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleCoverFileChange(e) {
    const file = e.target.files[0];

    if (!file) return;

    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setStatus("saving");
    setError("");

    try {
      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("type", form.type);
      formData.append("excerpt", form.excerpt);
      formData.append("content", form.content);
      formData.append("published", form.published);

      // Add cover image if the user selected one
      if (coverFile) {
        formData.append("coverImage", coverFile);
      }

      if (isEditing) {
        await api.updateArticle(id, formData);
      } else {
        await api.createArticle(formData);
      }

      setStatus("success");

      setTimeout(() => {
        navigate("/admin/articles");
      }, 1000);
    } catch (err) {
      setStatus("error");
      setError(err.message);
    }
  }

  const existingCoverUrl = form.coverImage
    ? form.coverImage.startsWith("http")
      ? form.coverImage
      : `${IMAGE_BASE_URL}${form.coverImage}`
    : null;

  return (
    <>
      <AdminNav />

      <div className="max-w-3xl mx-auto px-5 md:px-8 pt-24 pb-24">
        <h1 className="font-display text-3xl mb-1 mt-8">
          {isEditing ? "Edit Article" : "New Article"}
        </h1>

        <p className="text-ivory/50 text-sm mb-8">
          Used for Reviews, News, Guides, Lifestyle, and Travel content across
          the site.
        </p>

        {status === "success" && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm rounded-md p-4 mb-6">
            Saved. Redirecting...
          </div>
        )}

        {status === "error" && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-md p-4 mb-6">
            Failed to save: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm text-ivory/70 mb-1.5">Title</label>

            <input
              required
              className="input-field w-full"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
            />
          </div>

          {/* Content Type */}
          <div>
            <label className="block text-sm text-ivory/70 mb-1.5">
              Content Type
            </label>

            <select
              className="input-field w-full"
              value={form.type}
              onChange={(e) => update("type", e.target.value)}
            >
              {TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Cover Photo */}
          <div>
            <label className="block text-sm text-ivory/70 mb-1.5">
              Cover Photo
            </label>

            {(coverPreview || existingCoverUrl) && (
              <img
                src={coverPreview || existingCoverUrl}
                alt="Cover preview"
                className="w-full h-48 object-cover rounded-md mb-3 border border-charcoal-700"
              />
            )}

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleCoverFileChange}
              className="text-sm text-ivory/60"
            />

            <p className="text-xs text-ivory/40 mt-1">
              {isEditing
                ? "Choose a new photo to replace the current cover."
                : "The photo will be uploaded with the article."}
            </p>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm text-ivory/70 mb-1.5">
              Excerpt (short summary shown in listings)
            </label>

            <textarea
              required
              rows={2}
              className="input-field w-full"
              value={form.excerpt}
              onChange={(e) => update("excerpt", e.target.value)}
            />
          </div>

          {/* Full Content */}
          <div>
            <label className="block text-sm text-ivory/70 mb-1.5">
              Full Content
            </label>

            <textarea
              required
              rows={10}
              className="input-field w-full"
              value={form.content}
              onChange={(e) => update("content", e.target.value)}
            />
          </div>

          {/* Published */}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => update("published", e.target.checked)}
            />
            Published (visible on the site)
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={status === "saving"}
            className="bg-accent text-charcoal-950 font-medium px-8 py-3 rounded-sm disabled:opacity-60"
          >
            {status === "saving"
              ? "Saving..."
              : isEditing
                ? "Save Changes"
                : "Publish Article"}
          </button>
        </form>
      </div>
    </>
  );
}
