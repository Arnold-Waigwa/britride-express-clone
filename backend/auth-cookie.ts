import type { Request, Response } from "express";

export const AUTH_COOKIE_NAME = "authToken";

export function setAuthCookie(res: Response, token: string) {
  res.setHeader("Cache-Control", "no-store");
  res.cookie(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: Bun.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api",
    maxAge: 24 * 60 * 60 * 1000,
  });
}

export function getAuthCookie(req: Request): string | undefined {
  const cookie = req.headers.cookie
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${AUTH_COOKIE_NAME}=`));

  if (!cookie) return undefined;
  try {
    return decodeURIComponent(cookie.slice(AUTH_COOKIE_NAME.length + 1));
  } catch {
    return undefined;
  }
}
