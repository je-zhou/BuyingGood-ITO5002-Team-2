"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, MessageSquare, Users } from "lucide-react";
import { sendGeneralContactEmail } from "@/lib/actions";
import { toast } from "sonner";

// Contact form schema
const contactFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  company: z.string().optional(),
  category: z.enum(["general", "testimonial", "careers"], {
    message: "Please select a category.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      category: undefined,
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof contactFormSchema>) {
    setIsSubmitting(true);

    try {
      const result = await sendGeneralContactEmail(values);

      if (result.success) {
        toast(
          <div style={{ fontWeight: "normal" }}>
            <div>Thank you for your message! 🌱</div>
            <br />
            <div>
              Someone from the BuyingGood team will be in touch as soon as possible.
            </div>
          </div>,
          {
            duration: 8000,
            style: {
              minHeight: "80px",
              fontSize: "16px",
              lineHeight: "1.5",
              padding: "16px 20px",
              backgroundColor: "#1ca81c",
              color: "white",
              border: "none",
            },
          }
        );
        form.reset();
      } else {
        toast.error("Failed to send message. Please try again.");
        console.error("Contact form error:", result.error);
      }
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
      console.error("Contact form error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We&apos;re here to help connect you with local farmers, answer your questions, 
            and support you in making sustainable food choices. Whether you&apos;re a farmer, 
            retailer, or consumer, we&apos;d love to hear from you.
          </p>
        </div>

        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6 rounded-lg border border-gray-200 bg-gray-50">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">For Farmers</h3>
            <p className="text-sm text-gray-600">
              Get help with listing your farm, managing products, or connecting with local buyers.
            </p>
          </div>

          <div className="text-center p-6 rounded-lg border border-gray-200 bg-gray-50">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">General Inquiries</h3>
            <p className="text-sm text-gray-600">
              Have questions about how BuyingGood works or need technical support?
            </p>
          </div>

          <div className="text-center p-6 rounded-lg border border-gray-200 bg-gray-50">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Feedback</h3>
            <p className="text-sm text-gray-600">
              Share your experience using BuyingGood and help us improve our platform.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Send us a Message
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Fill out the form below and we&apos;ll get back to you as soon as possible. 
              We typically respond within 24-48 hours.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-900">
                        Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your name"
                          autoComplete="off"
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
                      <FormLabel className="text-sm font-medium text-gray-900">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your email address"
                          type="email"
                          autoComplete="off"
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
                      <FormLabel className="text-sm font-medium text-gray-900">
                        Company{" "}
                        <span className="text-gray-400">(optional)</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your company name"
                          autoComplete="off"
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
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-900">
                        Category
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full border-gray-300 focus:border-gray-500 focus:ring-gray-500">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="testimonial">Testimonial</SelectItem>
                          <SelectItem value="careers">Careers</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-900">
                        Message
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us how we can help you..."
                          autoComplete="off"
                          className="min-h-32 border-gray-300 focus:border-gray-500 focus:ring-gray-500 resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Form>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-16 p-8 bg-green-50 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Thank you for being part of our community!
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            BuyingGood connects local farmers with their communities, creating 
            sustainable food systems that benefit everyone. Your feedback and 
            participation help us build a better platform for all.
          </p>
        </div>
      </div>
    </div>
  );
}
