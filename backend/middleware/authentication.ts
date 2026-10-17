import type { Request, Response, NextFunction } from "express";
import { jwtVerify } from "jose";

export default async function authentication(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const header = req.get("authorization");

  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing token" });
  }

  const token = header.slice(7);
  const secret = new TextEncoder().encode(Bun.env.JWT_SECRET);

  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
      requiredClaims: ["exp"],
    });

    res.locals.user = { id: payload.id };
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  next();
}
