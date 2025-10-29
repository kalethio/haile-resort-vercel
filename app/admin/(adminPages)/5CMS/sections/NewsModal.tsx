"use client";

import { useState, useEffect } from "react";
import { X, Plus, Edit, Trash } from "lucide-react";

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

  // Confirmation modal states
  const [confirmAction, setConfirmAction] = useState<null | {
    type: "add" | "update" | "delete";
    index?: number;
  }>(null);
  const [limitAlert, setLimitAlert] = useState(false);

  // Load news from API
  useEffect(() => {
    fetch("/api/news")
      .then((res) => res.json())
      .then((data) => setNews(data))
      .catch(console.error);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (editIndex !== null) {
  //     setConfirmAction({ type: "update" });
  //   } else {
  //     if (news.length >= 3) {
  //       setLimitAlert(true);
  //       return;
  //     }
  //     setConfirmAction({ type: "add" });
  //   }
  // };
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

    try {
      await fetch("/api/news", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedNews),
      });
    } catch (err) {
      console.error(err);
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

    try {
      await fetch("/api/news", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedNews),
      });
    } catch (err) {
      console.error(err);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-xl max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Manage Latest News
          </h2>
          <button onClick={onClose} className="p-2 rounded hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* News List */}
          <div className="space-y-3 mb-6">
            {news.length === 0 && (
              <p className="text-gray-500 text-center">No news items yet.</p>
            )}

            {news.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-start p-3 bg-gray-50 rounded-lg border"
              >
                <div>
                  <h3 className="font-semibold text-gray-800">{item.title}</h3>
                  <p className="text-sm text-gray-800">{item.desc}</p>
                  <p className="text-xs text-gray-700 mt-1">{item.detail}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(index)}
                    className="p-1 rounded hover:bg-blue-100"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4 text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="p-1 rounded hover:bg-red-100"
                    title="Delete"
                  >
                    <Trash className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Button */}
          {/* {!isFormOpen && (
            <button
              onClick={() => {
                if (news.length >= 3) setLimitAlert(true);
                else setIsFormOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
            >
              <Plus className="w-4 h-4" />
              Add News
            </button>
          )} */}
          {!isFormOpen && (
            <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
            >
              <Plus className="w-4 h-4" />
              Add News
            </button>
          )}
          {/* Add/Edit Form */}
          {isFormOpen && (
            <form
              onSubmit={handleSubmit}
              className="mt-4 p-4 bg-gray-50 rounded-lg border space-y-3"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 p-2 border rounded-md text-gray-800 placeholder-gray-400 focus:ring focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Short Description
                </label>
                <input
                  type="text"
                  name="desc"
                  value={formData.desc}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 p-2 border rounded-md text-gray-800 placeholder-gray-400 focus:ring focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Detail
                </label>
                <textarea
                  name="detail"
                  value={formData.detail}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full mt-1 p-2 border rounded-md text-gray-800 placeholder-gray-400 focus:ring focus:ring-primary/30"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                >
                  {editIndex !== null ? "Update" : "Add"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {confirmAction.type === "delete"
                ? "Delete this news?"
                : confirmAction.type === "update"
                  ? "Update this news?"
                  : "Add this news?"}
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to{" "}
              <span className="font-semibold text-primary">
                {confirmAction.type}
              </span>{" "}
              this item?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 rounded-md border text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={
                  confirmAction.type === "delete"
                    ? confirmDelete
                    : confirmSubmit
                }
                className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90"
              >
                Yes, {confirmAction.type}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Limit Alert Modal */}
      {limitAlert && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Limit Reached
            </h3>
            <p className="text-gray-600 mb-4">
              You can only have up to{" "}
              <span className="font-semibold text-primary">3 news items</span>.
              Please delete one to add a new one.
            </p>
            <button
              onClick={() => setLimitAlert(false)}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
