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
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

const Navbar = () => {
  const paths: { label: string; url: string }[] = [
    { label: "Rides", url: "/rides" },
    { label: "Create New Rides", url: "/create-ride" },
    { label: "My Rides", url: "/my-rides" },
  ];

  return (
    <header className="flex justify-between items-center">
      <div className="flex-1">
        <h1>BritRide</h1>
      </div>
      <NavigationMenu className="flex-none">
        <NavigationMenuList>
          {paths.map((path) => (
            <NavigationMenuItem key={path.url}>
              <NavigationMenuLink href={path.url}>
                {path.label}
              </NavigationMenuLink>
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
