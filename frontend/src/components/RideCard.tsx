import { Card } from "./ui/card";

interface Props {
  title: string;
  price: number;
  location: string;
  status: "OPEN" | "ACCEPTED";
}

const RideCard = ({ title, price, location, status }: Props) => {
  return (
    <Card className="w-full transition-transform hover:scale-105">
      <div className="flex justify-between p-4">
        <p>{title}</p>
        <p>{status}</p>
      </div>
      <div className="flex justify-between p-4">
        <p>{location}</p>
        <p>{price}</p>
      </div>
    </Card>
  );
};

export default RideCard;
