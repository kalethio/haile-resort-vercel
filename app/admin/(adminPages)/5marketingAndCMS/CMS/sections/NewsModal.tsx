"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash } from "lucide-react";

type Props = { onClose: () => void };
type NewsForm = { title: string; desc: string; detail: string };

export default function NewsModal({ onClose }: Props) {
  const [news, setNews] = useState<NewsForm[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<NewsForm>({
    title: "",
    desc: "",
    detail: "",
  });
  const [loading, setLoading] = useState(false);

  // Confirmation modal states
  const [confirmAction, setConfirmAction] = useState<null | {
    type: "add" | "update" | "delete";
    index?: number;
  }>(null);

  // Load news from API
  useEffect(() => {
    setLoading(true);
    fetch("/api/news")
      .then((res) => res.json())
      .then((data) => setNews(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editIndex !== null) {
      setConfirmAction({ type: "update" });
    } else {
      setConfirmAction({ type: "add" });
    }
  };

  const confirmSubmit = async () => {
    const updatedNews = [...news];

    if (confirmAction?.type === "update" && editIndex !== null) {
      updatedNews[editIndex] = formData;
    } else if (confirmAction?.type === "add") {
      updatedNews.push(formData);
    }

    setNews(updatedNews);
    handleCloseForm();
    setLoading(true);

    try {
      await fetch("/api/news", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedNews),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }

    setConfirmAction(null);
  };

  const handleDelete = (index: number) => {
    setConfirmAction({ type: "delete", index });
  };

  const confirmDelete = async () => {
    if (confirmAction?.index === undefined) return;

    const updatedNews = news.filter((_, i) => i !== confirmAction.index);
    setNews(updatedNews);
    setLoading(true);

    try {
      await fetch("/api/news", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedNews),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }

    setConfirmAction(null);
  };

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setFormData(news[index]);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormData({ title: "", desc: "", detail: "" });
    setEditIndex(null);
    setIsFormOpen(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto h-full flex flex-col">
      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Add Button */}
        {!isFormOpen && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center m-2 gap-3 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200 font-semibold shadow-sm hover:shadow-md"
          >
            <Plus className="w-5 h-5" />
            Add News Item
          </button>
        )}

        {/* Add/Edit Form */}
        {isFormOpen && (
          <div className="mt-6 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {editIndex !== null ? "Edit News Item" : "Add News Item"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-900 placeholder-gray-500 font-medium"
                  placeholder="Enter news title"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Short Description *
                </label>
                <input
                  type="text"
                  name="desc"
                  value={formData.desc}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-900 placeholder-gray-500 font-medium"
                  placeholder="Brief description of the news"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Full Details *
                </label>
                <textarea
                  name="detail"
                  value={formData.detail}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-900 placeholder-gray-500 font-medium resize-none"
                  placeholder="Provide the complete news details..."
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors shadow-sm"
                >
                  {editIndex !== null ? "Update News" : "Add News"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* News List */}
        <div className="space-y-4 mb-6">
          {loading ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <p className="text-gray-500 text-lg font-medium">Loading...</p>
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <p className="text-gray-500 text-lg font-medium">
                No news items yet.
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Get started by adding your first news item
              </p>
            </div>
          ) : (
            news.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-start p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-lg mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-700 mb-2 line-clamp-2">{item.desc}</p>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {item.detail}
                  </p>
                </div>
                <div className="flex gap-2 ml-4 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(index)}
                    className="p-2 rounded-lg hover:bg-blue-50 transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4 text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete"
                  >
                    <Trash className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">
              {confirmAction.type === "delete"
                ? "Delete News Item?"
                : confirmAction.type === "update"
                  ? "Update News Item?"
                  : "Add News Item?"}
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to {confirmAction.type} this news item?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmAction(null)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={
                  confirmAction.type === "delete"
                    ? confirmDelete
                    : confirmSubmit
                }
                className="flex-1 px-4 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Yes, {confirmAction.type}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
