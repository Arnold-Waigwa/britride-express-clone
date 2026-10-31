import { useState } from "react";
import { Menu } from "@base-ui/react/menu";
import { Bell, ChevronDown, LogOut, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

type NavbarProps = {
  onNotificationsClick?: () => void;
  onSignOut?: () => void;
};

const Navbar = ({ onNotificationsClick, onSignOut }: NavbarProps) => {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );

  const toggleTheme = () => {
    const nextIsDark = !isDark;
    document.documentElement.classList.toggle("dark", nextIsDark);
    setIsDark(nextIsDark);
  };
  const paths: { label: string; path: string }[] = [
    { label: "Rides", path: "/" },
    { label: "Request a Ride", path: "/request" },
    { label: "My Rides", path: "/my-rides" },
  ];
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
      <a
        href="/"
        className="rounded-md text-lg font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        BritRide Express
      </a>
      <NavigationMenu
        aria-label="Main navigation"
        className="order-last w-full max-w-none flex-none sm:order-none sm:w-auto"
      >
        <NavigationMenuList>
          {paths.map((p) => (
            <NavigationMenuItem key={p.path}>
              <NavigationMenuLink href={p.path}>{p.label}</NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Dark mode"
          aria-pressed={isDark}
          onClick={toggleTheme}
        >
          {isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          onClick={onNotificationsClick}
          disabled={!onNotificationsClick}
        >
          <Bell aria-hidden="true" />
        </Button>
        <Menu.Root>
          <Menu.Trigger render={<Button variant="ghost" />}>
            Account <ChevronDown aria-hidden="true" />
          </Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner align="end" sideOffset={8} className="z-50">
              <Menu.Popup className="min-w-40 rounded-lg border bg-popover p-1 text-popover-foreground shadow-md outline-none">
                <Menu.Item
                  onClick={onSignOut}
                  disabled={!onSignOut}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm outline-none data-highlighted:bg-muted data-disabled:cursor-default data-disabled:opacity-50"
                >
                  <LogOut className="size-4" aria-hidden="true" />
                  Sign Out
                </Menu.Item>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
      </div>
    </header>
  );
};

export default Navbar;
