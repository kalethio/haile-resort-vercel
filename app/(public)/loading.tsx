// app/loading.tsx
export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="w-12 h-12 border-3 border-gray-300 border-t-premium rounded-full animate-spin" />
    </div>
  );
}
