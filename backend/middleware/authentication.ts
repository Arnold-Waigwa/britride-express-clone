import type { Request, Response, NextFunction } from "express";
import { jwtVerify } from "jose";
import { getAuthCookie } from "../auth-cookie";

export default async function authentication(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res.setHeader("Cache-Control", "no-store");
  const token = getAuthCookie(req);

  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const secret = new TextEncoder().encode(Bun.env.JWT_SECRET);

  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
      requiredClaims: ["exp"],
    });

    if (!Number.isSafeInteger(payload.id) || (payload.id as number) <= 0) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    res.locals.user = { id: payload.id };
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  next();
}
