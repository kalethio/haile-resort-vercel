// app/admin/8systemAdmin/user-role/components/modals/ViewUserModal.tsx
"use client";

interface ViewUserModalProps {
  user: any;
  onClose: () => void;
  onEdit: () => void;
}

export default function ViewUserModal({
  user,
  onClose,
  onEdit,
}: ViewUserModalProps) {
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      ACTIVE: "bg-green-100 text-green-800",
      INACTIVE: "bg-gray-100 text-gray-800",
      SUSPENDED: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div
      className="fixed inset-0 bg-accent/30 bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg w-full max-w-md mx-4 shadow-lg">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-black">User Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-lg font-semibold text-gray-600">
                {user.name
                  ? user.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                  : "?"}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-black">
                {user.name || "No Name"}
              </h3>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Role
              </label>
              <p className="text-black mt-1">{user.role?.name || "No Role"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Status
              </label>
              <span
                className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}
              >
                {user.status.toLowerCase()}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Branch
              </label>
              <p className="text-black mt-1">
                {user.branch?.branchName || "System"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Created
              </label>
              <p className="text-black mt-1 text-sm">
                {formatDate(user.createdAt)}
              </p>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-600">
                Last Updated
              </label>
              <p className="text-black mt-1 text-sm">
                {formatDate(user.updatedAt)}
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-6">
            <button
              onClick={onClose}
              className="flex-1 border border-gray-300 text-black rounded py-2 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={onEdit}
              className="flex-1 bg-black text-white rounded py-2 hover:bg-gray-800 transition-colors"
            >
              Edit User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
