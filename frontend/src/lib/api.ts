import axios from "axios";

export const api = axios.create({ baseURL: "/api", withCredentials: true });

export interface AuthUser {
  id: number;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
}

// A missing or expired session returns 401; other errors remain visible to callers.
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const { data } = await api.get<{ user: AuthUser }>("/auth/me");
    return data.user;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) return null;
    throw error;
  }
}
