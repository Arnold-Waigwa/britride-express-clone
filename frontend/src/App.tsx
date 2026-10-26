import { useEffect, useState } from "react";

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
    <div>
      {rides.map((ride) => (
        <li key={ride.id}>{ride.title}</li>
      ))}
    </div>
  );
};

export default App;
