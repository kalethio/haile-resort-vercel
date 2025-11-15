"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash } from "lucide-react";

type Props = { onClose: () => void };
type ChatbotItem = {
  id: number;
  response: string;
  triggers?: string[];
  role?: string;
  type: "RESPONSE" | "QUICK_REPLY";
  active: boolean;
};

type ChatbotForm = {
  response: string;
  triggers: string;
  role: string;
  type: "RESPONSE" | "QUICK_REPLY";
  active: boolean;
};

export default function ChatbotModal({ onClose }: Props) {
  const [items, setItems] = useState<ChatbotItem[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState<ChatbotForm>({
    response: "",
    triggers: "",
    role: "",
    type: "RESPONSE",
    active: true,
  });
  const [loading, setLoading] = useState(false);

  const [confirmAction, setConfirmAction] = useState<null | {
    type: "add" | "update" | "delete";
    id?: number;
  }>(null);

  // Load items from API
  useEffect(() => {
    setLoading(true);
    fetch("/api/admin/chatbot")
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editId !== null) {
      setConfirmAction({ type: "update", id: editId });
    } else {
      setConfirmAction({ type: "add" });
    }
  };

  const confirmSubmit = async () => {
    if (!confirmAction) return;

    setLoading(true);

    try {
      const itemData = {
        response: formData.response,
        triggers:
          formData.type === "RESPONSE"
            ? formData.triggers
                .split(",")
                .map((t) => t.trim())
                .filter((t) => t)
            : [],
        role: formData.role || null,
        type: formData.type,
        active: formData.active,
      };

      if (confirmAction.type === "update" && confirmAction.id) {
        await fetch(`/api/admin/chatbot/${confirmAction.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(itemData),
        });
      } else if (confirmAction.type === "add") {
        await fetch("/api/admin/chatbot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(itemData),
        });
      }

      const response = await fetch("/api/admin/chatbot");
      const data = await response.json();
      setItems(data);
      handleCloseForm();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }

    setConfirmAction(null);
  };

  const handleDelete = (id: number) => {
    setConfirmAction({ type: "delete", id });
  };

  const confirmDelete = async () => {
    if (confirmAction?.id === undefined) return;

    setLoading(true);

    try {
      await fetch(`/api/admin/chatbot/${confirmAction.id}`, {
        method: "DELETE",
      });

      const response = await fetch("/api/admin/chatbot");
      const data = await response.json();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }

    setConfirmAction(null);
  };

  const handleEdit = (item: ChatbotItem) => {
    setEditId(item.id);
    setFormData({
      response: item.response,
      triggers: item.triggers?.join(", ") || "",
      role: item.role || "",
      type: item.type,
      active: item.active,
    });
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormData({
      response: "",
      triggers: "",
      role: "",
      type: "RESPONSE",
      active: true,
    });
    setEditId(null);
    setIsFormOpen(false);
  };

  const botResponses = items.filter((item) => item.type === "RESPONSE");
  const quickReplies = items.filter((item) => item.type === "QUICK_REPLY");

  return (
    <div className="w-full max-w-6xl mx-auto h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {!isFormOpen && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center m-2 gap-3 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200 font-semibold shadow-sm hover:shadow-md"
          >
            <Plus className="w-5 h-5" />
            Add Chatbot Item
          </button>
        )}

        {isFormOpen && (
          <div className="mt-6 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {editId !== null ? "Edit Chatbot Item" : "Add Chatbot Item"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-900 font-medium"
                >
                  <option value="RESPONSE">Bot Response</option>
                  <option value="QUICK_REPLY">Quick Reply</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Response Text *
                </label>
                <textarea
                  name="response"
                  value={formData.response}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-900 placeholder-gray-500 font-medium resize-none"
                  placeholder="Enter the response text..."
                ></textarea>
              </div>

              {formData.type === "RESPONSE" && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Triggers (comma separated)
                    </label>
                    <input
                      type="text"
                      name="triggers"
                      value={formData.triggers}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-900 placeholder-gray-500 font-medium"
                      placeholder="hi, hello, greetings"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Role
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-900 font-medium"
                    >
                      <option value="">None</option>
                      <option value="reception">Reception</option>
                      <option value="spa">Spa</option>
                      <option value="restaurant">Restaurant</option>
                      <option value="booking">Booking</option>
                    </select>
                  </div>
                </>
              )}

              <div className="flex items-center justify-end">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                  <input
                    type="checkbox"
                    name="active"
                    checked={formData.active}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary focus:ring-primary/50 border-gray-300 rounded"
                  />
                  Active
                </label>
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
                  {editId !== null ? "Update Item" : "Add Item"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Bot Responses ({botResponses.length})
            </h3>
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  <p className="text-gray-500 text-lg font-medium">
                    Loading...
                  </p>
                </div>
              ) : botResponses.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  <p className="text-gray-500 text-lg font-medium">
                    No bot responses yet.
                  </p>
                </div>
              ) : (
                botResponses.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-start p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            item.active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.active ? "Active" : "Inactive"}
                        </span>
                        {item.role && (
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                            {item.role}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-900 font-medium mb-2">
                        {item.response}
                      </p>
                      {item.triggers && item.triggers.length > 0 && (
                        <p className="text-gray-600 text-sm">
                          <strong>Triggers:</strong> {item.triggers.join(", ")}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 rounded-lg hover:bg-blue-50 transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
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

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Quick Replies ({quickReplies.length})
            </h3>
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  <p className="text-gray-500 text-lg font-medium">
                    Loading...
                  </p>
                </div>
              ) : quickReplies.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  <p className="text-gray-500 text-lg font-medium">
                    No quick replies yet.
                  </p>
                </div>
              ) : (
                quickReplies.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-start p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            item.active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <p className="text-gray-900 font-medium">
                        {item.response}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 rounded-lg hover:bg-blue-50 transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
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
        </div>
      </div>

      {confirmAction && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">
              {confirmAction.type === "delete"
                ? "Delete Chatbot Item?"
                : confirmAction.type === "update"
                  ? "Update Chatbot Item?"
                  : "Add Chatbot Item?"}
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to {confirmAction.type} this chatbot item?
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
