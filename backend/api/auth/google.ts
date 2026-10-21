import { Router, type Request, type Response } from "express";
import passport from "passport";
import { generateJWT } from "../../utils";
const router = Router();

router.get(
  "/",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

router.get(
  "/callback",
  passport.authenticate("google", { session: false }),
  async (req: Request, res: Response) => {
    const user = req.user;

    if (!user || !user.email) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    const token = await generateJWT({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
    });

    res.send({ token });
  },
);

export default router;
