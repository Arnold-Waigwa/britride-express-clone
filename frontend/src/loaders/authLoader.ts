import { api } from "@/lib/api";
import axios from "axios";
import { redirect } from "react-router-dom";

export interface AuthUser {
  id: number;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
}

// Missing or expired sessions redirect to login; other failures reach the route error boundary.
export async function requireAuth(): Promise<AuthUser> {
  try {
    const { data } = await api.get<{ user: AuthUser }>("/auth/me");
    return data.user;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw redirect("/login");
      }
      throw new Response("Authentication service unavailable", {
        status: error.response?.status ?? 503,
      });
    }
    throw new Response("Authentication service unavailable", {
      status: 503,
    });
  }
}
