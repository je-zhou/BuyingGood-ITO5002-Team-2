"use server";

import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Please enter a valid email address"),
  company: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
  farmId: z.string().min(1, "Farm ID is required"),
  farmName: z.string().min(1, "Farm name is required"),
  farmEmail: z.email("Farm email is required"),
});

export async function sendContactEmail(formData: {
  name: string;
  email: string;
  company?: string;
  message: string;
  farmId: string;
  farmName: string;
  farmEmail: string;
}) {
  try {
    const validatedData = contactFormSchema.parse(formData);

    const { data, error } = await resend.emails.send({
      from: "BuyingGood <buyinggood@021-commerce.com.au>", // Replace with your verified domain
      to: [validatedData.farmEmail],
      subject: `New inquiry from ${validatedData.name} via Buying Good`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Form Submission</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #555;">Contact Details</h3>
            <p><strong>Name:</strong> ${validatedData.name}</p>
            <p><strong>Email:</strong> ${validatedData.email}</p>
            ${validatedData.company ? `<p><strong>Company:</strong> ${validatedData.company}</p>` : ""}
            <p><strong>Farm:</strong> ${validatedData.farmName}</p>
          </div>
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
            <h3 style="margin-top: 0; color: #555;">Message</h3>
            <p style="white-space: pre-wrap;">${validatedData.message}</p>
          </div>
          <div style="margin-top: 20px; padding: 15px; background-color: #e8f4f8; border-radius: 8px;">
            <p style="margin: 0; font-size: 14px; color: #666;">
              This message was sent through the Buying Good platform. You can reply directly to this email to respond to ${validatedData.name}.
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: "Failed to send email" };
    }

    return { success: true, message: "Email sent successfully", id: data?.id };
  } catch (error) {
    console.error("Contact form error:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        details: error.issues,
      };
    }

    return { success: false, error: "Internal server error" };
  }
}
