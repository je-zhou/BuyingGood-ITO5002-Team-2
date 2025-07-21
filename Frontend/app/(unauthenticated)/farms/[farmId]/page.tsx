'use client';

import { notFound } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

interface Farm {
  farmId: string;
  name: string;
  description: string;
  address: {
    city: string;
    state: string;
  };
  opening_hours: string;
  produce: Produce[];
}

interface Produce {
  id: string;
  name: string;
  price: number;
  unit: string;
  availability: string;
  category: string;
}

// Contact form schema
const contactFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  subject: z.string().min(5, {
    message: "Subject must be at least 5 characters.",
  }),
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
      subject: "",
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

  // Group produce by category
  const produceByCategory = farm.produce.reduce((acc, produce) => {
    const category = produce.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(produce);
    return acc;
  }, {} as Record<string, Produce[]>);

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

        {/* Photo Gallery */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((index) => (
              <div key={index} className="aspect-square border border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                <span className="text-gray-500">Photo</span>
              </div>
            ))}
          </div>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(produceByCategory).map(([category, items]) => (
              <div key={category} className="border border-gray-300 rounded-lg p-6 text-center">
                <h3 className="font-semibold text-gray-900 mb-2 capitalize">
                  {category === 'coffeeAndTea' ? 'Coffee & Tea' : 
                   category === 'nutsSeeds' ? 'Nuts & Seeds' : 
                   category === 'eggsAndMilk' ? 'Eggs & Milk' :
                   category === 'herbsAndSpices' ? 'Herbs & Spices' :
                   category.charAt(0).toUpperCase() + category.slice(1)}
                </h3>
                <div className="text-2xl mb-2">
                  {category === 'honey' && '🍯'}
                  {category === 'vegetables' && '🥕'}
                  {category === 'fruits' && '🍎'}
                  {category === 'coffeeAndTea' && '☕'}
                  {category === 'nutsSeeds' && '🥜'}
                  {category === 'eggsAndMilk' && '🥛'}
                  {category === 'herbsAndSpices' && '🌿'}
                  {category === 'grain' && '🌾'}
                  {category === 'legumes' && '🫘'}
                  {category === 'livestock' && '🐄'}
                  {category === 'seafood' && '🐟'}
                  {category === 'forestry' && '🌲'}
                </div>
                <p className="text-sm text-gray-600">
                  {items.length} item{items.length !== 1 ? 's' : ''} available
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Get in Touch Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Get in Touch</h2>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-gray-700">
                <span>📍</span>
                <span>{farm.address.city} {farm.address.state}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <span>📞</span>
                <span>+61 123 456 789</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <span>✉️</span>
                <span>contact@buyinggood.farm</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <span>🕒</span>
                <span>{farm.opening_hours}</span>
              </div>
            </div>
            
            {/* Map placeholder */}
            <div className="w-full h-32 bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Map</span>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your name" {...field} />
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
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter subject" {...field} />
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
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter your message here..." 
                          className="min-h-24"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">
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