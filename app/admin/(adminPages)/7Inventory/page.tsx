export default function InventoryPlaceholder() {
  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-normal text-gray-900">
            Inventory Management
          </h1>
          <p className="text-gray-600 mt-2">
            Advanced inventory tracking and management
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-8 text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>

          {/* Message */}
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Advanced Inventory Management
          </h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            This module provides comprehensive inventory tracking, stock
            management, and supply chain optimization specifically designed for
            hotel and resort operations.
          </p>

          {/* Features List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-lg mx-auto">
            {[
              "Real-time stock tracking",
              "Supplier management",
              "Automated reordering",
              "Waste management",
              "Cost optimization",
              "Multi-location support",
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center text-sm text-gray-700"
              >
                <svg
                  className="w-4 h-4 text-green-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {feature}
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Interested in this feature?
            </h3>
            <p className="text-gray-600 text-md fontweight-semibold mb-4">
              Contact Us
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
