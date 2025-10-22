"use client";
import { useState } from "react";
import BranchList from "./branchComponents/BranchList";
import AddBranchForm from "./branchComponents/AddBranchForm";
import EditBranchForm from "./branchComponents/EditBranchForm"; // ✅ Added import

interface BranchManagerModalProps {
  onClose: () => void;
}

export default function BranchManagerModal({
  onClose,
}: BranchManagerModalProps) {
  const [activeView, setActiveView] = useState<"list" | "add" | "edit">("list");
  const [editingBranch, setEditingBranch] = useState<any>(null);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {activeView === "list" && "Branch Management"}
            {activeView === "add" && "Create New Branch"}
            {activeView === "edit" && `Edit ${editingBranch?.branchName}`}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-auto max-h-[calc(90vh-80px)]">
          {activeView === "list" && (
            <BranchList
              onAddNew={() => setActiveView("add")}
              onEditBranch={(branch) => {
                setEditingBranch(branch);
                setActiveView("edit");
              }}
            />
          )}

          {activeView === "add" && (
            <AddBranchForm
              onCancel={() => setActiveView("list")}
              onSuccess={() => setActiveView("list")}
            />
          )}

          {activeView === "edit" && editingBranch && (
            <EditBranchForm
              branch={editingBranch}
              onCancel={() => {
                setActiveView("list");
                setEditingBranch(null);
              }}
              onSuccess={() => {
                setActiveView("list");
                setEditingBranch(null);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
