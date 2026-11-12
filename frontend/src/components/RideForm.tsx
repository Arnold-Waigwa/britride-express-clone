import { CalendarDays, CarFront, MapPin } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";

const CreateRideForm = () => {
  return (
    <Card className="mx-auto mt-8 w-full max-w-2xl border border-border/70 bg-card shadow-lg shadow-foreground/5">
      <CardHeader className="gap-2 border-b border-border/70 bg-muted/30 px-6 py-6 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <CarFront aria-hidden="true" className="size-5" />
          </div>
          <div>
            <CardTitle className="text-xl">Create a new ride</CardTitle>
            <CardDescription className="mt-1">
              Share the details of your journey with the community.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-6 py-6 sm:px-8">
        <form className="space-y-6">
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
              name="title"
              placeholder="e.g. Morning commute to Jackson"
              type="text"
            />
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
                  name="departureLocation"
                  placeholder="Starting point"
                  type="text"
                />
              </div>
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
                  name="destinationLocation"
                  placeholder="Where are you going?"
                  type="text"
                />
              </div>
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
                  name="departureTime"
                  type="datetime-local"
                />
              </div>
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
                  £
                </span>
                <input
                  className="flex h-11 w-full rounded-lg border border-input bg-background pl-8 pr-3 text-sm shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20"
                  id="ride-price"
                  min="0"
                  name="price"
                  placeholder="0.00"
                  step="0.01"
                  type="number"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-border/70 pt-6 sm:flex-row sm:justify-end">
            <Button
              className="w-full sm:w-auto"
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button className="w-full sm:w-auto" type="submit">
              Publish ride
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateRideForm;
