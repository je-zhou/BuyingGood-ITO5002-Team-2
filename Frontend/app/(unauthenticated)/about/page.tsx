import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About Us - Buying Good",
  description: "Learn about Buying Good's mission to connect consumers with local farmers and promote sustainable agriculture practices.",
  openGraph: {
    title: "About Us - Buying Good",
    description: "Learn about our mission to connect consumers with local farmers and promote sustainable agriculture practices.",
  },
};

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            About BuyingGood
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Connecting communities with local farmers to create sustainable food systems
            that benefit everyone.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <Image
              src="/farmer.png"
              alt="Local farmer with fresh produce"
              width={500}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </div>
          
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-gray-900">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              BuyingGood was born from a simple observation: fresh produce often travels
              thousands of kilometers to reach distribution centers, only to return to
              supermarket shelves right next to the farm where it originated.
            </p>
            <p className="text-gray-600 leading-relaxed">
              By the time it reaches consumers, the produce isn&apos;t as fresh, and the
              unnecessary freight costs are absorbed by buyers. We believe there&apos;s a
              better way.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our platform directly connects local farmers with their communities,
              reducing waste, supporting local economies, and ensuring consumers get
              the freshest produce possible.
            </p>
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-semibold text-gray-900 text-center mb-12">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Sustainability</h3>
              <p className="text-gray-600">
                Promoting environmentally responsible farming practices and reducing
                the carbon footprint of food distribution.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Community</h3>
              <p className="text-gray-600">
                Strengthening local food systems by connecting farmers directly
                with their neighbors and local businesses.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔄</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Transparency</h3>
              <p className="text-gray-600">
                Providing clear information about where your food comes from
                and how it&apos;s grown, building trust between farmers and consumers.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-green-50 rounded-xl p-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">
            Join Our Community
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Whether you&apos;re a farmer looking to connect with local buyers or a consumer
            seeking fresh, local produce, BuyingGood is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/farms">
              <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg">
                Explore Local Farms
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 text-lg">
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
