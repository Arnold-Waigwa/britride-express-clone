import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";

const Navbar = () => {
  const paths: { label: string; url: string }[] = [
    { label: "Rides", url: "/rides" },
    { label: "Create New Ride", url: "/create-ride" },
    { label: "My Rides", url: "/my-rides" },
  ];

  return (
    <header className="flex justify-between items-center border-b-2 mb-2 p-4">
      <div className="flex-1">
        <h1>BritRide</h1>
      </div>
      <NavigationMenu className="flex-none">
        <NavigationMenuList>
          {paths.map((path) => (
            <NavigationMenuItem key={path.url}>
              <Link
                to={path.url}
                className="flex items-center gap-1.5 rounded-md p-2 text-sm transition-all outline-none hover:bg-muted focus:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                {path.label}
              </Link>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
      <div className="flex flex-1 items-center justify-end gap-8">
        <div>light mode</div>
        <div>notification</div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger>Account</DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuItem>Sign Out</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
