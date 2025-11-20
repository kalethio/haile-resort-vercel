// app/admin/6emailMarketing/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Subscriber } from "@/app/data/subscriber";
import {
  Send,
  Users,
  Mail,
  Trash2,
  CheckSquare,
  Square,
  RefreshCw,
  Save,
  FolderOpen,
  Plus,
  X,
} from "lucide-react";

interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  content: string;
}

export default function EmailMarketingAdmin() {
  const [subs, setSubs] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [subject, setSubject] = useState("");
  const [html, setHtml] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<
    "compose" | "subscribers" | "templates"
  >("compose");
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");

  // Load subscribers
  async function loadSubscribers() {
    setLoading(true);
    try {
      const res = await fetch("/api/subscribers");
      if (!res.ok) throw new Error("Failed to load subscribers");
      const data: Subscriber[] = await res.json();
      setSubs(data);
      const sel: Record<string, boolean> = {};
      data.forEach((s) => (sel[s.id] = false));
      setSelected(sel);
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to load subscribers" });
    } finally {
      setLoading(false);
    }
  }

  // Load templates
  async function loadTemplates() {
    try {
      const res = await fetch("/api/email-templates");
      if (res.ok) {
        const data = await res.json();
        setTemplates(data);
      }
    } catch (err) {
      console.error("Failed to load templates:", err);
    }
  }

  // Load drafts from localStorage
  function loadDraft() {
    const draft = localStorage.getItem("emailCampaignDraft");
    if (draft) {
      const { subject: draftSubject, html: draftHtml } = JSON.parse(draft);
      setSubject(draftSubject || "");
      setHtml(draftHtml || "");
    }
  }

  // Save draft to localStorage
  function saveDraft() {
    const draft = { subject, html };
    localStorage.setItem("emailCampaignDraft", JSON.stringify(draft));
    setMessage({ type: "success", text: "Draft saved locally" });
  }

  // Add unsubscribe link to content
  function insertUnsubscribeLink() {
    const unsubscribeHtml = `<p style="color: #666; font-size: 12px; margin-top: 20px;">
      <a href="[unsubscribe_url]" style="color: #666;">Unsubscribe</a> from these emails
    </p>`;
    setHtml((prev) => prev + unsubscribeHtml);
  }

  // Save as template
  async function saveAsTemplate() {
    if (!newTemplateName.trim() || !subject.trim()) {
      setMessage({
        type: "error",
        text: "Template name and subject are required",
      });
      return;
    }

    try {
      const res = await fetch("/api/email-templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newTemplateName,
          subject,
          content: html,
        }),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Template saved successfully" });
        setShowTemplateModal(false);
        setNewTemplateName("");
        loadTemplates();
      } else {
        throw new Error("Failed to save template");
      }
    } catch (err) {
      setMessage({ type: "error", text: "Failed to save template" });
    }
  }

  // Load template
  function loadTemplate(template: EmailTemplate) {
    setSubject(template.subject);
    setHtml(template.content);
    setMessage({ type: "success", text: `Template "${template.name}" loaded` });
  }

  useEffect(() => {
    loadSubscribers();
    loadTemplates();
    loadDraft();
  }, []);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    const interval = setInterval(saveDraft, 30000);
    return () => clearInterval(interval);
  }, [subject, html]);

  function toggle(id: string) {
    setSelected((p) => ({ ...p, [id]: !p[id] }));
  }

  function toggleAll() {
    const allSelected = Object.values(selected).every(Boolean);
    const newSelection = Object.fromEntries(
      subs.map((s) => [s.id, !allSelected])
    );
    setSelected(newSelection);
  }

  async function remove(id: string) {
    if (!confirm("Delete this subscriber?")) return;
    const res = await fetch(`/api/subscribers/${id}`, { method: "DELETE" });
    if (res.ok) {
      await loadSubscribers();
      setMessage({ type: "success", text: "Subscriber deleted successfully" });
    } else {
      setMessage({ type: "error", text: "Delete failed" });
    }
  }

  async function sendCampaign() {
    if (!subject.trim()) {
      setMessage({ type: "error", text: "Subject is required" });
      return;
    }
    if (!html.trim()) {
      setMessage({ type: "error", text: "Message content is required" });
      return;
    }

    const targetIds = Object.keys(selected).filter((id) => selected[id]);
    if (targetIds.length === 0) {
      setMessage({
        type: "error",
        text: "Please select at least one subscriber",
      });
      return;
    }

    setSending(true);
    setMessage(null);

    try {
      const res = await fetch("/api/subscribers/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, html, targetIds }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || "Send failed");

      setMessage({
        type: "success",
        text: `Campaign sent to ${targetIds.length} subscribers`,
      });
      setSubject("");
      setHtml("");
      setSelected(Object.fromEntries(subs.map((s) => [s.id, false])));
      localStorage.removeItem("emailCampaignDraft"); // Clear draft after sending
    } catch (err: any) {
      console.error(err);
      setMessage({ type: "error", text: err.message || "Send failed" });
    } finally {
      setSending(false);
    }
  }

  const selectedCount = Object.values(selected).filter(Boolean).length;
  const totalCount = subs.length;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Mail className="w-6 h-6" />
            Email Marketing
          </h1>
          <p className="text-gray-600 mt-1">
            Manage subscribers and send campaigns
          </p>
        </div>
        <button
          onClick={loadSubscribers}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Subscribers
              </p>
              <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckSquare className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Selected</p>
              <p className="text-2xl font-bold text-gray-900">
                {selectedCount}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Send className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Ready to Send</p>
              <p className="text-2xl font-bold text-gray-900">
                {selectedCount > 0 ? "Yes" : "No"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <FolderOpen className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Templates</p>
              <p className="text-2xl font-bold text-gray-900">
                {templates.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("compose")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "compose"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Compose Campaign
          </button>
          <button
            onClick={() => setActiveTab("subscribers")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "subscribers"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Subscribers ({totalCount})
          </button>
          <button
            onClick={() => setActiveTab("templates")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "templates"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Templates ({templates.length})
          </button>
        </nav>
      </div>

      {/* Message Alert */}
      {message && (
        <div
          className={`p-4 rounded-lg border ${
            message.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Compose Tab */}
      {activeTab === "compose" && (
        <div className="bg-white rounded-lg border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Send className="w-5 h-5" />
              Compose Email Campaign
            </h2>
            <div className="flex gap-2">
              <button
                onClick={saveDraft}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Save className="w-4 h-4" />
                Save Draft
              </button>
              <button
                onClick={() => setShowTemplateModal(true)}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <FolderOpen className="w-4 h-4" />
                Save as Template
              </button>
              <button
                onClick={insertUnsubscribeLink}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Plus className="w-4 h-4" />
                Add Unsubscribe
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <input
                placeholder="Enter email subject..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message Content *
              </label>
              <textarea
                placeholder="Write your email content here... (HTML supported)"
                value={html}
                onChange={(e) => setHtml(e.target.value)}
                rows={8}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary font-mono text-sm"
              />
              <div className="mt-2 text-xs text-gray-500">
                Auto-saved locally every 30 seconds
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">
                {selectedCount} of {totalCount} subscribers selected
              </div>
              <div className="flex gap-2">
                <button
                  onClick={toggleAll}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
                >
                  {selectedCount === totalCount ? "Deselect All" : "Select All"}
                </button>
                <button
                  onClick={sendCampaign}
                  disabled={sending || selectedCount === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  {sending ? "Sending..." : `Send to ${selectedCount}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subscribers Tab */}
      {activeTab === "subscribers" && (
        <div className="bg-white rounded-lg border">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Subscriber List
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{selectedCount} selected</span>
              <button
                onClick={toggleAll}
                className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100"
              >
                {selectedCount === totalCount ? "Deselect All" : "Select All"}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
              Loading subscribers...
            </div>
          ) : subs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No subscribers yet</p>
            </div>
          ) : (
            <div className="divide-y">
              {subs.map((s) => (
                <div
                  key={s.id}
                  className="p-4 hover:bg-gray-50 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={!!selected[s.id]}
                      onChange={() => toggle(s.id)}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <div>
                      <div className="font-medium text-gray-900">
                        {s.name || "No name"}
                      </div>
                      <div className="text-sm text-gray-600">{s.email}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        Subscribed {new Date(s.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => remove(s.id)}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete subscriber"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === "templates" && (
        <div className="bg-white rounded-lg border">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FolderOpen className="w-5 h-5" />
              Email Templates
            </h2>
            <button
              onClick={() => setShowTemplateModal(true)}
              className="flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              <Plus className="w-4 h-4" />
              New Template
            </button>
          </div>

          {templates.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <FolderOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No templates yet</p>
              <p className="text-sm mt-2">
                Save your first template from the Compose tab
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="p-4 hover:bg-gray-50 flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium text-gray-900">
                      {template.name}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {template.subject}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Created{" "}
                      {new Date(template.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        loadTemplate(template);
                        setActiveTab("compose");
                      }}
                      className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary/90"
                    >
                      Use Template
                    </button>
                    <button
                      onClick={() => {
                        // Add delete functionality later
                        alert("Delete functionality coming soon");
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Save Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Save as Template</h3>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template Name
                </label>
                <input
                  type="text"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  placeholder="e.g., Welcome Email, Promotion"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowTemplateModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={saveAsTemplate}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  Save Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
