import { Router, type Request, type Response } from "express";
import authentication from "../../middleware/authentication";
import { db } from "../../src/prisma/db";

const router = Router();

router.get(
  "/",
  authentication,
  async (_req: Request, res: Response<unknown, { user: { id: number } }>) => {
    try {
      const user = await db.orm.public.User.first({ id: res.locals.user.id });

      if (!user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      return res.json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
        },
      });
    } catch (error) {
      console.error("Error fetching authenticated user", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
);

export default router;
