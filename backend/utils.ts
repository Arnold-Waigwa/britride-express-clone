import * as jose from "jose";

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
  return new jose.SignJWT({
    email,
    firstName,
    lastName,
    id,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1d")
    .sign(secret);
};
