import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In / Sign Up - Buying Good",
  description: "Join the Buying Good community. Sign in to manage your farm or sign up to connect with local farmers and fresh produce.",
  openGraph: {
    title: "Join Buying Good - Connect with Local Farmers",
    description: "Sign up to connect with local farmers and discover fresh, sustainable produce in your area.",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}