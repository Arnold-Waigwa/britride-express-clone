import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import RideCard from "./components/RideCard";
import RidePagination from "./components/RidePagination";
type Ride = {
  id: number;
  title: string;
  departureLocation: string;
  price: number;
  status: "OPEN" | "ACCEPTED";
};

const App = () => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const limit = 5;

  useEffect(() => {
    const fetchRides = async () => {
      const response = await fetch(
        `/api/rides?limit=${limit}&offset=${offset}`,
      );
      const data = await response.json();
      setRides(data.rides);
      setTotal(data.total);
    };

    fetchRides();
  }, [offset]);
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
      <RidePagination total={total} limit={limit} onOffsetChange={setOffset} />
    </main>
  );
};

export default App;
