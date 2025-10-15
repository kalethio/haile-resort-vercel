// src/components/branchModal.tsx
"use client";
import React, { useEffect, useState } from "react";
import BranchPageForm from "./branchComponents/branchPageContent";
import BranchPageContent from "./branchComponents/branchPageForm";

export default function BranchModal() {
  const [branches, setBranches] = useState<any[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const res = await fetch("/api/branches");
    const data = await res.json();
    setBranches(data);
  }

  return (
    <div className="p-4 text-black">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Branches</h2>
        <button
          className="px-3 py-2 bg-slate-800 text-white rounded"
          onClick={() => setShowCreate(true)}
        >
          + Create Branch
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {branches.map((b) => (
          <div
            key={b.slug}
            className="border rounded-lg p-3 bg-white hover:shadow cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{b.branchName}</div>
                <div className="text-sm text-gray-600">/{b.slug}</div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setEditingSlug(b.slug)}
                  className="px-2 py-1 border rounded text-sm"
                >
                  Edit
                </button>
                <a
                  href={`/branches/${b.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2 py-1 border rounded text-sm"
                >
                  View
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create modal */}
      {showCreate && (
        <Modal
          title="Create Branch"
          onClose={() => {
            setShowCreate(false);
            load();
          }}
        >
          <BranchPageForm
            onCreated={() => {
              setShowCreate(false);
              load();
            }}
          />
        </Modal>
      )}

      {/* Edit modal */}
      {editingSlug && (
        <Modal
          title={`Edit: ${editingSlug}`}
          onClose={() => {
            setEditingSlug(null);
            load();
          }}
        >
          <BranchPageContent
            slug={editingSlug}
            onSaved={() => {
              setEditingSlug(null);
              load();
            }}
          />
        </Modal>
      )}
    </div>
  );
}

/* Simple Modal used by component */
function Modal({
  title,
  onClose,
  children,
}: {
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-4xl rounded shadow p-6 z-10 overflow-y-auto max-h-[80vh] text-black">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">{title}</h3>
          <button onClick={onClose} className="px-2 py-1 border rounded">
            Close
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
