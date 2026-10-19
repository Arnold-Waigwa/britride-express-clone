import { Router, type Request, type Response } from "express";
import { registerUserSchema, type userRegisterType } from "../../schema";
import validateBody from "../../middleware/validation";
import { db } from "../../src/prisma/db";
import { generateJWT } from "../../utils";

const router = Router();

interface InputBodyLocals {
  validatedBody: userRegisterType;
}

router.post(
  "/",
  validateBody(registerUserSchema),
  async (_req: Request, res: Response<unknown, InputBodyLocals>) => {
    const { email, firstName, lastName, password } = res.locals.validatedBody;

    let user;
    try {
      //make sure user doesn't already exist
      user = await db.orm.public.User.first({ email });

      if (user)
        return res.status(409).send("Email already associated with a user");

      //safe to proceed
      const hashedPassword = await Bun.password.hash(password);
      user = await db.orm.public.User.create({
        email,
        first_name: firstName,
        last_name: lastName,
        passwordHash: hashedPassword,
      });

      const token = await generateJWT({
        email,
        firstName,
        lastName,
        id: user.id,
      });

      res.status(201).send({ token });
    } catch (error) {
      console.log("Error occurred creating user", error);
      res.status(500).send({ error: "Internal server error" });
    }
  },
);

export default router;
