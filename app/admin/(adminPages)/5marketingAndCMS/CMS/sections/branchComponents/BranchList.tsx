"use client";
import { useState, useEffect } from "react";

interface BranchListProps {
  onAddNew: () => void;
  onEditBranch: (branch: any) => void;
}

export default function BranchList({
  onAddNew,
  onEditBranch,
}: BranchListProps) {
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const response = await fetch("/api/admin/branches");
      const data = await response.json();
      setBranches(data);
    } catch (error) {
      console.error("Failed to fetch branches:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (branchId: number, branchName: string) => {
    if (!confirm(`Are you sure you want to delete "${branchName}"?`)) return;

    setDeleting(branchId);
    try {
      const branch = branches.find((b) => b.id === branchId);
      if (!branch) return;

      const response = await fetch(`/api/admin/branches/${branch.slug}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchBranches(); // Refresh the list
      } else {
        alert("Failed to delete branch");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete branch");
    } finally {
      setDeleting(null);
    }
  };

  if (loading)
    return <div className="text-center py-8">Loading branches...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">
          Manage all your hotel branches in one place
        </p>
        <button
          onClick={onAddNew}
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
        >
          + Add New Branch
        </button>
      </div>

      {branches.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
          <div className="text-gray-400 text-6xl mb-4">🏨</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No branches yet
          </h3>
          <p className="text-gray-600 mb-6">
            Create your first branch to get started
          </p>
          <button
            onClick={onAddNew}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
          >
            Create First Branch
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {branches.map((branch) => (
            <div
              key={branch.id}
              className="bg-gray-50 p-4 rounded-lg border hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-lg">
                      {branch.branchName}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        branch.published
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {branch.published ? "Published" : "Draft"}
                    </span>
                    <span className="text-yellow-500 text-sm">
                      {"★".repeat(branch.starRating)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">
                    {branch.location.city}, {branch.location.country}
                  </p>
                  <p className="text-gray-500 text-xs">
                    🏞️ {branch._count.attractions} attractions • 🏨{" "}
                    {branch._count.accommodations} accommodations • 🎯{" "}
                    {branch._count.experiences} experiences
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => onEditBranch(branch)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(branch.id, branch.branchName)}
                    disabled={deleting === branch.id}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:bg-red-400 text-sm"
                  >
                    {deleting === branch.id ? "..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
