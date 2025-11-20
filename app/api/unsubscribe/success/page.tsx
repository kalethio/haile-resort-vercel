// app/unsubscribe/success/page.tsx
export default function UnsubscribeSuccess() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-lg text-center">
        <h1 className="text-2xl font-semibold mb-4">
          You have been unsubscribed
        </h1>
        <p className="text-sm text-gray-600">
          Your email has been removed from our mailing list. We are sorry to see
          you go.
        </p>
      </div>
    </main>
  );
}
