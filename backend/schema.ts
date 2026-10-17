import { z } from "zod";
import { Temporal } from "temporal-polyfill";
import type { Varchar, Numeric } from "@prisma/orm-postgres/target/codec-types";

export const inputRideSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1)
    .max(50)
    .transform((value) => value as Varchar<50>),
  departureLocation: z
    .string()
    .trim()
    .min(1)
    .max(255)
    .transform((value) => value as Varchar<255>),
  destinationLocation: z
    .string()
    .trim()
    .min(1)
    .max(255)
    .transform((value) => value as Varchar<255>),
  departure: z.iso
    .datetime({ local: true })
    .transform((value) => Temporal.PlainDateTime.from(value))
    .refine(
      (value) =>
        Temporal.PlainDateTime.compare(
          value,
          Temporal.Now.plainDateTimeISO("America/Detroit"),
        ) > 0,
      { message: "Departure must be in the future" },
    ),
  description: z.string().trim().min(1).max(5000),
  price: z
    .number()
    .positive()
    .max(99_999_999.99)
    .multipleOf(0.01)
    .transform((value) => value.toFixed(2) as Numeric<10, 2>),
});

export const registerUserSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1)
    .max(50)
    .transform((value) => value as Varchar<50>),
  lastName: z
    .string()
    .trim()
    .min(1)
    .max(50)
    .transform((value) => value as Varchar<50>),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(255)
    .pipe(z.email())
    .refine((value) => value.endsWith("@albion.edu"), {
      message: "Use your Albion email address",
    })
    .transform((value) => value as Varchar<255>),
  password: z.string().min(12).max(255),
});

export const signInUserSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(255)
    .pipe(z.email())
    .refine((value) => value.endsWith("@albion.edu"), {
      message: "Use your Albion email address",
    })
    .transform((value) => value as Varchar<255>),
  password: z.string().min(1).max(255),
});

export type userSignInType = z.infer<typeof signInUserSchema>;

export type userRegisterType = z.infer<typeof registerUserSchema>;

export type rideInputType = z.infer<typeof inputRideSchema>;
