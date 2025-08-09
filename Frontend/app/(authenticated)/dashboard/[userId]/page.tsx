"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UserDashboardRedirect({ params }: { params: Promise<{ userId: string }> }) {
  const router = useRouter();

  useEffect(() => {
    params.then((resolvedParams) => {
      // Redirect to the my-farms page by default
      router.replace(`/dashboard/${resolvedParams.userId}/my-farms`);
    });
  }, [params, router]);

  // Show loading state
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}