export default function Help() {
  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-normal text-gray-900 mb-8">
          Help & Support
        </h1>

        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Getting Started
            </h2>
            <p className="text-gray-600">
              Use the sidebar to navigate between different admin sections. Each
              section manages specific hotel operations.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Need Help?
            </h2>
            <p className="text-gray-600 mb-4">
              Contact our support team for assistance with the admin panel.
            </p>
            <div className="text-sm text-gray-600">
              <p>📞 Support: +251-911-123-456</p>
              <p>✉️ Email: support@hailehotel.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
