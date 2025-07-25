import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Farms - Buying Good",
  description: "Search for local farms and fresh produce near you. Find sustainable, locally-grown food directly from farmers in your area.",
  openGraph: {
    title: "Search Farms - Buying Good",
    description: "Search for local farms and fresh produce near you. Find sustainable, locally-grown food directly from farmers.",
  },
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}