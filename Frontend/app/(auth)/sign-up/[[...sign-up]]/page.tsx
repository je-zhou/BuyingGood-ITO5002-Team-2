import { SignUp } from "@clerk/nextjs";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center h-screen pb-32">
      <div className="space-y-2">
        {/* Back Button */}
        <Link
          href="/"
          className="flex items-center space-x-1 text-gray-500 w-fit"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span className="text-sm font-medium ">Back to Home</span>
        </Link>

        {/* Auth Component */}
        <SignUp />
      </div>
    </div>
  );
}
