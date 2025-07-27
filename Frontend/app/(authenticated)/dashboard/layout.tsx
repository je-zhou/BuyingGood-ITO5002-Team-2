import { Metadata } from "next";
import DashboardNavbar from "@/components/layout/DashboardNavbar";

export const metadata: Metadata = {
  title: "Farmer Dashboard - Buying Good",
  description: "Manage your farm profile, products, and connect with local customers through the Buying Good platform.",
  openGraph: {
    title: "Farmer Dashboard - Buying Good",
    description: "Manage your farm profile and products on the Buying Good platform.",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <DashboardNavbar />
      <main className="flex-grow w-full max-w-screen-xl mx-auto px-4">
        {children}
      </main>
    </div>
  );
}