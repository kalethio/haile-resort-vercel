import { Suspense } from "react";
import LoginContent from "./LoginContent";

function LoginSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>
        </div>
        <div className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="h-12 bg-gray-200 rounded-t-md animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded-b-md animate-pulse"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded-md animate-pulse"></div>
          <div className="h-20 bg-gray-100 rounded-lg animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginContent />
    </Suspense>
  );
}
