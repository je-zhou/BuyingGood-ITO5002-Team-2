import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Local Farms - Buying Good",
  description:
    "Search and discover local farms and fresh produce near you. Find sustainable, locally-grown food directly from farmers in your area.",
  openGraph: {
    title: "Local Farms - Buying Good",
    description:
      "Search and discover local farms and fresh produce near you. Find sustainable, locally-grown food directly from farmers.",
  },
};

export default function FarmsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="max-w-screen-2xl mx-auto">{children}</div>;
}
