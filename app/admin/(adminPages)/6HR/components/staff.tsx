"use client";

export default function StaffManagement() {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <span className="text-2xl">👥</span>
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Staff Management System
      </h2>
      <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
        Complete employee management solution for scheduling, performance
        tracking, and operational efficiency.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-left">
          <h3 className="font-semibold text-gray-900 mb-3">
            Employee Management
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Employee profiles and records</li>
            <li>• Attendance and time tracking</li>
            <li>• Performance reviews</li>
            <li>• Training and certifications</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 text-left">
          <h3 className="font-semibold text-gray-900 mb-3">
            Scheduling & Operations
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Room cleaning schedules</li>
            <li>• Shift planning and rotation</li>
            <li>• Task assignment</li>
            <li>• Real-time updates</li>
          </ul>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 max-w-2xl mx-auto">
        <h3 className="text-lg font-medium text-gray-900 mb-3">
          Ready to optimize your staff management?
        </h3>
        <p className="text-gray-600 mb-6">
          This comprehensive system will streamline your hotel operations,
          improve staff efficiency, and enhance guest satisfaction.
        </p>
        <button className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
          Contact Us to Build This Feature
        </button>
      </div>
    </div>
  );
}
