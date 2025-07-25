import { Metadata } from "next";
import Landing from "@/components/Landing/Landing";

export const metadata: Metadata = {
  title: "Buying Good - Connect with Local Farmers",
  description: "Find fresh, local produce directly from farms near you. A non-profit initiative connecting consumers with local farmers and supporting sustainable agriculture.",
  openGraph: {
    title: "Buying Good - Connect with Local Farmers",
    description: "Find fresh, local produce directly from farms near you. Supporting sustainable agriculture and local communities.",
  },
};

export default function Home() {
  return <Landing></Landing>;
}
