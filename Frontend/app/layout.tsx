import { type Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Buying Good - Connect with Local Farmers",
  description: "A non-profit initiative connecting consumers with local farmers to challenge wasteful logistical practices of large food distributors. Find fresh, local produce directly from farms near you.",
  keywords: ["local farmers", "fresh produce", "sustainable food", "farm to table", "local food", "organic farming"],
  authors: [{ name: "Buying Good Team" }],
  creator: "Buying Good",
  publisher: "Buying Good",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Buying Good - Connect with Local Farmers",
    description: "Find fresh, local produce directly from farms near you. Supporting sustainable agriculture and local communities.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Buying Good - Connect with Local Farmers",
    description: "Find fresh, local produce directly from farms near you. Supporting sustainable agriculture and local communities.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased leading-relaxed tracking-[0.01em]`}
        >
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
