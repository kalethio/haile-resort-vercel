// app/not-found.tsx
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-6xl font-bold text-premium mb-4">404</div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Page Not Found
        </h1>
        <p className="text-gray-600 mb-6">
          The page you are looking for does not exist.
        </p>
        <link
          href="/"
          className="bg-premium text-white px-6 py-3 rounded-lg hover:bg-premium/90 transition-colors inline-block"
        >
          Return Home
        </link>
      </div>
    </div>
  );
}
