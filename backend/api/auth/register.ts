//flow: receive {firstName, lastName, email, password}
//verify input using schema
//use bcrypt of bun to hash password and set hashedpassword to that
//create new record: firstname, lastname, email, password
//generate jwt using secret, and send as response
import express from "express";
import { registerUserSchema } from "../../schema";
import { db } from "../../src/prisma/db";
import * as jose from "jose";

const router = express.Router();

router.post("/", async (req, res) => {
  const validated = registerUserSchema.safeParse(req.body);

  if (!validated.success)
    return res.status(400).send({ errors: validated.error.issues });

  const { email, firstName, lastName, password } = validated.data;

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

    const secret = new TextEncoder().encode(Bun.env.JWT_SECRET);

    const token = await new jose.SignJWT({
      email,
      firstName,
      lastName,
      id: user.id,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1d")
      .sign(secret);

    res.status(201).send({ token });
  } catch (error) {
    console.log("Error occurred creating user", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

export default router;
