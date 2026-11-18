import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CarFront from "./CarFront";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { Alert, AlertTitle } from "./ui/alert";
import { api } from "@/lib/api";
import axios from "axios";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(255)
    .pipe(z.email())
    .refine((value) => value.endsWith("@albion.edu"), {
      message: "Use your Albion email address",
    }),
  password: z.string().min(1).max(255),
});

const nameSchema = z.string().trim().min(1, "Enter your name").max(50);

const AuthForm = ({ type }: { type: "login" | "register" }) => {
  const isLogin = type === "login";
  const navigate = useNavigate();
  const schema = loginSchema.extend({
    firstName: isLogin ? nameSchema.optional() : nameSchema,
    lastName: isLogin ? nameSchema.optional() : nameSchema,
    password: isLogin
      ? loginSchema.shape.password
      : z.string().min(12, "Use at least 12 characters").max(255),
  });
  type Form = z.infer<typeof schema>;
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<Form>({
    resolver: zodResolver(schema),
    shouldUnregister: true,
  });

  const onSubmit = async (values: Form) => {
    clearErrors("root");
    try {
      await api.post(isLogin ? "/auth/sign-in" : "/auth/register", values);
      navigate("/rides", { replace: true });
    } catch (error: unknown) {
      const body = axios.isAxiosError<
        string | { error?: string; errors?: { message: string }[] }
      >(error)
        ? error.response?.data
        : undefined;
      setError("root.server", {
        message:
          (typeof body === "string"
            ? body
            : body?.error || body?.errors?.[0]?.message) ||
          "Unable to authenticate. Please try again.",
      });
    }
  };

  return (
    <Card className="mx-auto w-full max-w-xl mt-4">
      <CardHeader className="w-full border-b bg-gray-50">
        <div className="flex justify-center gap-4 items-center">
          <CarFront />
          {isLogin ? (
            <CardTitle className="text-xl">Login</CardTitle>
          ) : (
            <CardTitle className="text-xl">Sign Up For An Account</CardTitle>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {errors.root?.server && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>{errors.root.server.message}</AlertTitle>
          </Alert>
        )}
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="space-y-6" disabled={isSubmitting}>
            {!isLogin && (
              <>
                <div>
                  <label
                    htmlFor="first-name"
                    className="text-sm font-medium leading-none"
                  >
                    First Name
                  </label>
                  <input
                    placeholder="Jane"
                    id="first-name"
                    className="flex h-11 w-full rounded-lg border border-input bg-background px-3 text-sm shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20"
                    autoComplete="given-name"
                    maxLength={50}
                    aria-invalid={Boolean(errors.firstName)}
                    aria-describedby={
                      errors.firstName ? "first-name-error" : undefined
                    }
                    {...register("firstName")}
                  />
                  {errors.firstName && (
                    <p
                      id="first-name-error"
                      className="text-sm text-destructive"
                    >
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="last-name" className="font-medium">
                    Last Name
                  </label>
                  <input
                    placeholder="Doe"
                    id="last-name"
                    className="flex w-full h-11 rounded-lg border border-input bg-background px-3 text-sm shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20"
                    autoComplete="family-name"
                    maxLength={50}
                    aria-invalid={Boolean(errors.lastName)}
                    aria-describedby={
                      errors.lastName ? "last-name-error" : undefined
                    }
                    {...register("lastName")}
                  />
                  {errors.lastName && (
                    <p
                      id="last-name-error"
                      className="text-sm text-destructive"
                    >
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </>
            )}
            <div>
              <label htmlFor="email" className="font-medium">
                Email
              </label>
              <input
                placeholder="janedoe@albion.edu"
                id="email"
                className="flex h-11 w-full rounded-lg border border-input bg-background px-3 text-sm shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20"
                type="email"
                autoComplete="username"
                maxLength={255}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
                {...register("email")}
              />
              {errors.email && (
                <p id="email-error" className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="font-medium">
                Password
              </label>
              <input
                id="password"
                placeholder="Enter your password"
                type="password"
                className="flex h-11 w-full rounded-lg border border-input bg-background px-3 text-sm shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20"
                autoComplete={isLogin ? "current-password" : "new-password"}
                maxLength={255}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
                {...register("password")}
              />
              {errors.password && (
                <p id="password-error" className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Please wait…" : isLogin ? "Sign in" : "Register"}
            </Button>
          </fieldset>
        </form>
        <div className="relative my-6">
          <div
            className="absolute inset-0 flex items-center"
            aria-hidden="true"
          >
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or</span>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={isSubmitting}
          onClick={() => window.location.assign("/api/auth/google")}
        >
          Continue with Google using your Albion email
        </Button>
      </CardContent>
    </Card>
  );
};

export default AuthForm;
