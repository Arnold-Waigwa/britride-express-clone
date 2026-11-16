import { CalendarDays, MapPin, Loader2, AlertCircle } from "lucide-react";
import CarFront from "./CarFront";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { api } from "@/lib/api";
import { Alert, AlertTitle } from "./ui/alert";

const rideSchema = z.object({
  title: z.string().trim().min(1, "Enter a title").max(50),
  departureLocation: z
    .string()
    .min(1, "Departure location must be at least one character")
    .max(255),
  destinationLocation: z
    .string()
    .min(1, "Departure destination must be at least one character")
    .max(255),
  departure: z.iso.datetime({ local: true }),
  description: z.string().trim().min(1, "Enter a description").max(5000),
  price: z.coerce.number().positive().max(99_999_999.99).multipleOf(0.01),
});

type Form = z.infer<typeof rideSchema>;

const CreateRideForm = () => {
  const {
    register,
    setError,
    clearErrors,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<z.input<typeof rideSchema>, unknown, Form>({
    resolver: zodResolver(rideSchema),
  });

  const onSubmit = async (data: Form) => {
    clearErrors("root");
    try {
      await api.post("/rides", data);
      reset();
    } catch (error: unknown) {
      const body = axios.isAxiosError<{
        error?: string;
        errors?: { message: string }[];
      }>(error)
        ? error.response?.data
        : undefined;

      setError("root.server", {
        message:
          body?.error ||
          body?.errors?.[0]?.message ||
          "Unable to publish your ride. Please try again.",
      });
    }
  };
  return (
    <Card className="mx-auto mt-8 w-full max-w-2xl border border-border/70 bg-card shadow-lg shadow-foreground/5">
      <CardHeader className="gap-2 border-b border-border/70 bg-muted/30 px-6 py-6 sm:px-8">
        <div className="flex items-center gap-3">
          <div>
            <CarFront />
            <CardTitle className="text-xl">Create a new ride</CardTitle>
            <CardDescription className="mt-1">
              Share the details of your journey with the community.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-6 py-6 sm:px-8">
        {errors.root?.server && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle />
            <AlertTitle>{errors.root.server.message}</AlertTitle>
          </Alert>
        )}

        {isSubmitSuccessful && !errors.root && (
          <p role="status" className="mb-6 text-sm">
            Your ride has been published.
          </p>
        )}
        <form
          className="space-y-6"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <fieldset disabled={isSubmitting} className="space-y-6">
            <div className="space-y-2">
              <label
                className="text-sm font-medium leading-none"
                htmlFor="ride-title"
              >
                Ride title
              </label>
              <input
                className="flex h-11 w-full rounded-lg border border-input bg-background px-3 text-sm shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20"
                id="ride-title"
                aria-invalid={Boolean(errors.title)}
                aria-describedby={errors.title ? "ride-title-error" : undefined}
                placeholder="e.g. Morning commute to Jackson"
                type="text"
                {...register("title")}
              />
              {errors.title && (
                <p id="ride-title-error" className="text-sm text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label
                  className="text-sm font-medium leading-none"
                  htmlFor="departure-location"
                >
                  Departure
                </label>
                <div className="relative">
                  <MapPin
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    className="flex h-11 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20"
                    id="departure-location"
                    aria-invalid={Boolean(errors.departureLocation)}
                    aria-describedby={
                      errors.departureLocation
                        ? "departure-location-error"
                        : undefined
                    }
                    placeholder="Starting point"
                    type="text"
                    {...register("departureLocation")}
                  />
                </div>
                {errors.departureLocation && (
                  <p
                    id="departure-location-error"
                    className="text-sm text-destructive"
                  >
                    {errors.departureLocation.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  className="text-sm font-medium leading-none"
                  htmlFor="destination-location"
                >
                  Destination
                </label>
                <div className="relative">
                  <MapPin
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    className="flex h-11 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20"
                    id="destination-location"
                    aria-invalid={Boolean(errors.destinationLocation)}
                    aria-describedby={
                      errors.destinationLocation
                        ? "destination-location-error"
                        : undefined
                    }
                    placeholder="Where are you going?"
                    {...register("destinationLocation")}
                    type="text"
                  />
                </div>
                {errors.destinationLocation && (
                  <p
                    id="destination-location-error"
                    className="text-sm text-destructive"
                  >
                    {errors.destinationLocation.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label
                  className="text-sm font-medium leading-none"
                  htmlFor="departure-time"
                >
                  Departure time
                </label>
                <div className="relative">
                  <CalendarDays
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    className="flex h-11 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm shadow-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20"
                    id="departure-time"
                    aria-invalid={Boolean(errors.departure)}
                    aria-describedby={
                      errors.departure ? "departure-time-error" : undefined
                    }
                    {...register("departure")}
                    type="datetime-local"
                  />
                </div>
                {errors.departure && (
                  <p
                    id="departure-time-error"
                    className="text-sm text-destructive"
                  >
                    {errors.departure.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  className="text-sm font-medium leading-none"
                  htmlFor="ride-price"
                >
                  Price per seat
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    $
                  </span>
                  <input
                    className="flex h-11 w-full rounded-lg border border-input bg-background pl-8 pr-3 text-sm shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20"
                    id="ride-price"
                    aria-invalid={Boolean(errors.price)}
                    aria-describedby={
                      errors.price ? "ride-price-error" : undefined
                    }
                    min="0.01"
                    {...register("price")}
                    placeholder="0.00"
                    step="0.01"
                    type="number"
                  />
                </div>
                {errors.price && (
                  <p id="ride-price-error" className="text-sm text-destructive">
                    {errors.price.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="ride-description" className="text-sm font-medium">
                Description
              </label>
              <textarea
                id="ride-description"
                className="min-h-24 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                maxLength={5000}
                aria-invalid={Boolean(errors.description)}
                aria-describedby={
                  errors.description ? "description-error" : undefined
                }
                {...register("description")}
              />
              {errors.description && (
                <p id="description-error" className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div className="flex justify-center gap-3 border-t border-border/70 pt-6 sm:flex-row sm:justify-end">
              <Button
                className="w-full sm:w-auto"
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => reset()}
              >
                Reset
              </Button>
              <Button
                className="w-full sm:w-auto"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Publishing…" : "Publish ride"}
                {isSubmitting && (
                  <Loader2 aria-hidden="true" className="animate-spin" />
                )}
              </Button>
            </div>
          </fieldset>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateRideForm;
