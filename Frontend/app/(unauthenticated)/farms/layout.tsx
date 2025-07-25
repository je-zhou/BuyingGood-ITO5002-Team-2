import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Farm Profiles - Buying Good",
  description: "Explore local farm profiles and discover fresh produce, contact information, and seasonal availability from farmers in your area.",
  openGraph: {
    title: "Farm Profiles - Buying Good",
    description: "Explore local farm profiles and discover fresh produce from farmers in your area.",
  },
};

export default function FarmsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}