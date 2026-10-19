import type { Request, Response, NextFunction } from "express";
import { z } from "zod";

export default function validateBody(schema: z.ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const validated = schema.safeParse(req.body);

    if (!validated.success) {
      return res.status(400).json({
        errors: validated.error.issues,
      });
    }

    res.locals.validatedBody = validated.data;
    next();
  };
}
