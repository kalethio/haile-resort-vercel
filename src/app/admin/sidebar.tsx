"use client";
import Link from "next/link";

export default function Sidebar() {
  const links = ["Dashboard", "Bookings", "Rooms", "Settings"];
  return (
    <aside className="w-64 bg-gray-800 text-white p-4 space-y-2">
      <h2 className="text-lg font-bold mb-4">Admin Panel</h2>
      {links.map((link) => (
        <Link
          key={link}
          href={`/admin/${link.toLowerCase()}`}
          className="block px-2 py-1 rounded hover:bg-gray-700"
        >
          {link}
        </Link>
      ))}
    </aside>
  );
}
