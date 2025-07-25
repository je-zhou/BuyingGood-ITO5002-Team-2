'use client';

import { notFound } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Map from '@/components/ui/map';
import ProductCard from '@/components/ProductCard/ProductCard';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

interface Farm {
  farmId: string;
  name: string;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  contact_email: string;
  contact_phone: string;
  opening_hours: string;
  produce: Produce[];
  ownerId: string;
  createdAt: string;
}

interface Produce {
  id: string;
  name: string;
  category: string[];
  description: string;
  pricePerUnit: number;
  unit: string;
  minimumOrderQuantity: number;
  minimumOrderUnit: string;
  availabilityWindows: {
    startMonth: number;
    endMonth: number;
  }[];
  images: string[];
  createdAt: string;
}

// Contact form schema
const contactFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  company: z.string().optional(),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

async function getFarmById(farmId: string): Promise<Farm | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/farms/${farmId}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching farm:', error);
    return null;
  }
}

export default function FarmDetailPage({ params }: { params: Promise<{ farmId: string }> }) {
  const router = useRouter();
  const [farm, setFarm] = useState<Farm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof contactFormSchema>) {
    console.log(values);
    // Handle form submission here
    alert("Message sent successfully!");
    form.reset();
  }

  useEffect(() => {
    const loadFarm = async () => {
      try {
        setLoading(true);
        const resolvedParams = await params;
        const farmData = await getFarmById(resolvedParams.farmId);
        if (!farmData) {
          notFound();
        }
        setFarm(farmData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load farm');
      } finally {
        setLoading(false);
      }
    };

    loadFarm();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2 text-gray-600">Loading farm details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  if (!farm) {
    notFound();
  }


  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm text-gray-600 mb-4">Producer Profile Page</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{farm.name}</h1>
          <div className="inline-block bg-gray-100 px-3 py-1 rounded text-sm text-gray-700">
            {farm.address.city} {farm.address.state}
          </div>
        </div>

        {/* Photo Gallery Carousel */}
        <div className="mb-8">
          <Carousel className="w-full max-w-4xl mx-auto">
            <CarouselContent>
              {[1, 2, 3, 4, 5].map((index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <div className="aspect-square border border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                      <span className="text-gray-500">Photo {index}</span>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        {/* About Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            {farm.description}
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </div>

        {/* We Produce Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">We Produce</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {farm.produce.map((produce) => {
              const primaryCategory = produce.category[0] || 'other';
              const categoryIcon = {
                'honey': '🍯',
                'vegetables': '🥕',
                'fruits': '🍎',
                'coffeeAndTea': '☕',
                'nutsSeeds': '🥜',
                'eggsAndMilk': '🥛',
                'herbs': '🌿',
                'herbsAndSpices': '🌿',
                'grain': '🌾',
                'legumes': '🫘',
                'livestock': '🐄',
                'seafood': '🐟',
                'forestry': '🌲',
                'other': '🌱'
              }[primaryCategory] || '🌱';

              return (
                <ProductCard 
                  key={produce.id} 
                  produce={produce} 
                  categoryIcon={categoryIcon}
                />
              );
            })}
          </div>
        </div>

        {/* Get in Touch Section */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Get in Touch</h2>
          
          {/* Contact Info and Map Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Contact Info Card */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3 text-gray-700">
                  <MapPin className="w-4 h-4 mt-1 text-gray-500" />
                  <div>
                    <div className="font-medium text-blue-600 underline cursor-pointer">
                      {farm.address.street} QLD {farm.address.zipCode}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>{farm.contact_phone}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>{farm.contact_email}</span>
                </div>
                <div className="flex items-start gap-3 text-gray-700">
                  <Clock className="w-4 h-4 mt-1 text-gray-500" />
                  <span>{farm.opening_hours}</span>
                </div>
              </div>
            </div>
            
            {/* Map Card */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="text-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Map</h3>
              </div>
              <div className="w-full h-48">
                <Map address={farm.address} className="w-full h-full rounded" />
              </div>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-gray-300 mb-8" />

          {/* Contact Form */}
          <div className="max-w-md mx-auto">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-900">Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your name" 
                          className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-900">Email Address</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your email address" 
                          type="email" 
                          className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-900">Company <span className="text-gray-400">(optional)</span></FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your company name" 
                          className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-900">Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter your message here..." 
                          className="min-h-32 border-gray-300 focus:border-gray-500 focus:ring-gray-500 resize-none"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800 h-12 text-base font-medium">
                  Submit
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}