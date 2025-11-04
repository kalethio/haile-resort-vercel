import Link from "next/link";
import { Plus } from "lucide-react";

export default function DashboardHeader() {
  return (
    <section>
      <div className="flex justify-between items-center">
        <div>
          <span className="text-2xl font-semibold text-gray-900">
            Dashboard
          </span>
          <span className="text-gray-600 mt-1">
            {" "}
            - Hotel performance overview
          </span>
        </div>
        <Link
          href="/admin/reservations/new"
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus size={16} />
          New Booking
        </Link>
      </div>
    </section>
  );
}
