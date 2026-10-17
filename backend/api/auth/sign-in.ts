//flow receive payload {email, password}
// verify input with sign in schema
//check that user exists, verify password or send generic message
//on success, create token and send

import express from "express";
import { signInUserSchema } from "../../schema";
import { db } from "../../src/prisma/db";
import * as jose from "jose";

const router = express.Router();

router.post("/", async (req, res) => {
  const validated = signInUserSchema.safeParse(req.body);

  if (!validated.success)
    return res.status(400).send({ errors: validated.error.issues });

  const { email, password } = validated.data;

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

    const secret = new TextEncoder().encode(Bun.env.JWT_SECRET);

    //username and password are valid, issue token
    const token = await new jose.SignJWT({
      email,
      firstName: user.first_name,
      lastName: user.last_name,
      id: user.id,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1d")
      .sign(secret);

    res.send({ token });
  } catch (error) {
    console.log("Error logging in user", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

export default router;
