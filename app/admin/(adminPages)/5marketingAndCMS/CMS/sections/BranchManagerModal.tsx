"use client";
import { useState } from "react";
import BranchList from "./branchComponents/BranchList";
import AddBranchForm from "./branchComponents/AddBranchForm";
import EditBranchForm from "./branchComponents/EditBranchForm";

interface BranchManagerModalProps {
  onClose: () => void;
}

export default function BranchManagerModal({
  onClose,
}: BranchManagerModalProps) {
  const [activeView, setActiveView] = useState<"list" | "add" | "edit">("list");
  const [editingBranch, setEditingBranch] = useState<any>(null);

  // Simple content display like Packages example
  if (activeView === "list") {
    return (
      <BranchList
        onAddNew={() => setActiveView("add")}
        onEditBranch={(branch) => {
          setEditingBranch(branch);
          setActiveView("edit");
        }}
      />
    );
  }

  if (activeView === "add") {
    return (
      <AddBranchForm
        onCancel={() => setActiveView("list")}
        onSuccess={() => setActiveView("list")}
      />
    );
  }

  if (activeView === "edit" && editingBranch) {
    return (
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
    );
  }

  return null;
}
