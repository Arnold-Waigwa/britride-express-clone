import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
type Ride = {
  id: number;
  title: string;
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
    <div className="max-w-6xl mx-auto">
      <Navbar />
      {rides.map((ride) => (
        <li key={ride.id} className="text-amber-300">
          {ride.title}
        </li>
      ))}
    </div>
  );
};

export default App;
