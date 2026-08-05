"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";

export async function submitContact(formData: FormData) {
  if (formData.get("company")) redirect("/contact-us?sent=1");

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (
    name.length < 2 ||
    name.length > 100 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    phone.length > 30 ||
    message.length < 10 ||
    message.length > 3000
  ) {
    redirect("/contact-us?error=invalid");
  }

  const supabase = createAdminClient();
  if (!supabase) redirect("/contact-us?error=config");

  const { error } = await supabase.from("contact_messages").insert({
    name,
    email,
    phone: phone || null,
    message,
  });

  if (error) {
    console.error("Contact form submission failed:", error.message);
    redirect("/contact-us?error=submit");
  }

  redirect("/contact-us?sent=1");
}
