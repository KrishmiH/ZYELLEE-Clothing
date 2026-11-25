
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/auth";

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();

  const token = cookieStore.get("zyellee-admin-session")?.value;

  if (!token) {
    return false;
  }

  return await verifyAdminToken(token);
}
