export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-white shadow rounded">📊 Bookings Today</div>
        <div className="p-4 bg-white shadow rounded">🏨 Occupancy Rate</div>
        <div className="p-4 bg-white shadow rounded">💰 Revenue</div>
        <div className="p-4 bg-white shadow rounded">📍 Active Branches</div>
      </div>
    </div>
  );
}
