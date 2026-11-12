import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import RideCard from "./components/RideCard";
type Ride = {
  id: number;
  title: string;
  departureLocation: string;
  price: number;
  status: "OPEN" | "ACCEPTED";
};

const App = () => {
  const [rides, setRides] = useState<Ride[]>([]);

  const fetchRides = async () => {
    const response = await fetch("/api/rides");
    const data = await response.json();
    setRides(data);
  };

  useEffect(() => {
    fetchRides();
  }, []);
  return (
    <main className="max-w-6xl mx-auto">
      <Navbar />
      <div className="mx-auto flex w-full max-w-125 flex-col gap-4 my-4">
        {rides.map((ride) => (
          <RideCard
            key={ride.id}
            location={ride.departureLocation}
            price={ride.price}
            title={ride.title}
            status={ride.status}
          />
        ))}
      </div>
    </main>
  );
};

export default App;
