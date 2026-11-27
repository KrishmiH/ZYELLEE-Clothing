import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-session";
import ThankYouCards from "@/components/admin/ThankYouCards";

export const instant = false;

export default async function ThankYouCardsPage() {
  const isAuthenticated = await isAdminAuthenticated();

  if (!isAuthenticated) {
    redirect("/admin/login");
  }

  return <ThankYouCards />;
}
