import { CarFront as CarFrontLucide } from "lucide-react";

const CarFront = () => {
  return (
    <div className="flex size-10 items-center justify-center rounded-full bg-purple-700 text-primary-foreground">
      <CarFrontLucide aria-hidden="true" className="size-5" />
    </div>
  );
};

export default CarFront;
