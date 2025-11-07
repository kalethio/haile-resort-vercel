export default function GuestExperiencePlaceholder() {
  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-normal text-gray-900">
            Guest Experience
          </h1>
          <p className="text-gray-600 mt-2">
            Guest services, loyalty programs, and experience management
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>

          {/* Message */}
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Premium Guest Experience Management
          </h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Complete guest journey management including loyalty programs,
            personalized services, feedback systems, and experience
            optimization.
          </p>

          {/* Features List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-lg mx-auto">
            {[
              "Loyalty program management",
              "Guest preference tracking",
              "Personalized services",
              "Feedback and review management",
              "Experience analytics",
              "VIP guest handling",
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
            <p className="text-gray-600 text-md font-semibold mb-4">
              Contact Us
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
