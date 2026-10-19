import { Router, type Request, type Response } from "express";
import { signInUserSchema, type userSignInType } from "../../schema";
import validateBody from "../../middleware/validation";
import { db } from "../../src/prisma/db";
import { generateJWT } from "../../utils";

const router = Router();

interface InputBodyLocals {
  validatedBody: userSignInType;
}

router.post(
  "/",
  validateBody(signInUserSchema),
  async (_req: Request, res: Response<unknown, InputBodyLocals>) => {
    const { email, password } = res.locals.validatedBody;

    try {
      const user = await db.orm.public.User.first({ email });

      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const isPasswordValid = await Bun.password.verify(
        password,
        user.passwordHash!,
      );

      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      //username and password are valid, issue token
      const token = await generateJWT({
        firstName: user.first_name,
        lastName: user.last_name,
        id: user.id,
        email,
      });

      res.send({ token });
    } catch (error) {
      console.log("Error logging in user", error);
      res.status(500).send({ error: "Internal server error" });
    }
  },
);

export default router;
