import { SignJWT } from "jose";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { db } from "./src/prisma/db";
import { registerUserSchema } from "./schema";
import Pusher from "pusher";

const googleUserSchema = registerUserSchema.omit({ password: true });

interface JwtPayLoad {
  email: string;
  firstName: string | null;
  lastName: string | null;
  id: number;
}

export const generateJWT = ({
  email,
  firstName,
  lastName,
  id,
}: JwtPayLoad): Promise<string> => {
  const secret = new TextEncoder().encode(Bun.env.JWT_SECRET);
  return new SignJWT({
    email,
    firstName,
    lastName,
    id,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1d")
    .sign(secret);
};

export function initializePassport() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: Bun.env.GOOGLE_CLIENT_ID!,
        clientSecret: Bun.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: "/api/auth/google/callback",
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          let user = await db.orm.public.User.first({ googleId: profile.id });
          if (user) return done(null, user);

          const validated = googleUserSchema.safeParse({
            firstName: profile.name?.givenName,
            lastName: profile.name?.familyName,
            email: profile.emails?.[0]?.value,
          });

          if (!validated.success) {
            return done(null, false, {
              message: "An Albion email and a valid name are required",
            });
          }

          const { firstName, lastName, email } = validated.data;

          const existingUser = await db.orm.public.User.first({ email });

          if (existingUser) {
            return done(null, false, {
              message: "Sign in to your existing account to link Google",
            });
          }
          user = await db.orm.public.User.create({
            googleId: profile.id,
            first_name: firstName,
            last_name: lastName,
            email,
          });

          return done(null, user);
        } catch (error) {
          return done(error as Error);
        }
      },
    ),
  );
}

export const pusher = new Pusher({
  appId: Bun.env.app_id!,
  key: Bun.env.key!,
  secret: Bun.env.secret!,
  cluster: Bun.env.cluster!,
  useTLS: true,
});
