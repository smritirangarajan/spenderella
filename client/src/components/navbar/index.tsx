import { useState } from "react";
import { Menu } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { PROTECTED_ROUTES } from "@/routes/common/routePath";
import { cn } from "@/lib/utils";
import spenderellaLogo from "../../assets/images/logo.png"; // Your new logo
import { Button } from "../ui/button";
import { Sheet, SheetContent } from "../ui/sheet";
import { UserNav } from "./user-nav";
import LogoutDialog from "./logout-dialog";
import { useTypedSelector } from "@/app/hook";

const Navbar = () => {
  const { pathname } = useLocation();
  const { user } = useTypedSelector((state) => state.auth);

  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const routes = [
    { href: PROTECTED_ROUTES.OVERVIEW, label: "Overview" },
    { href: PROTECTED_ROUTES.TRANSACTIONS, label: "Transactions" },
    { href: PROTECTED_ROUTES.REPORTS, label: "Reports" },
    { href: PROTECTED_ROUTES.SETTINGS, label: "Settings" },
  ];

  return (
    <>
      <header
        className={cn(
          "w-full px-4 py-3 lg:px-14 text-white",
          "bg-[linear-gradient(90deg,_var(--primary)_0%,_color-mix(in_oklch,_var(white)_78%,_white_22%)_50%,_var(white)_100%)]",
          pathname === PROTECTED_ROUTES.OVERVIEW && "!pb-3"
        )}
      >
        <div className="w-full flex h-14 max-w-[var(--max-width)] items-center mx-auto">
          <div className="w-full flex items-center justify-between">
            {/* Left: Logo + Mobile menu */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open navigation"
                className="inline-flex md:hidden !cursor-pointer !bg-white/10 !text-white hover:bg-white/15"
                onClick={() => setIsOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </Button>

              {/* Logo */}
              <NavLink to={PROTECTED_ROUTES.OVERVIEW} className="flex items-center gap-2">
                <img
                  src={spenderellaLogo}
                  alt="Spenderella Logo"
                  className="w-12 h-12 object-contain"
                />
                <span className="text-lg font-bold">Spenderella</span>
              </NavLink>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-x-1 overflow-x-auto">
              {routes.map((route) => (
                <Button
                  key={route.href}
                  size="sm"
                  variant="ghost"
                  className={cn(
                    "w-full lg:w-auto font-normal py-4.5 border-none text-white hover:text-white focus:bg-white/20 transition !bg-transparent !text-[14.5px]",
                    pathname === route.href && "font-semibold"
                  )}
                  asChild
                >
                  <NavLink to={route.href}>{route.label}</NavLink>
                </Button>
              ))}
            </nav>

            {/* Mobile Navigation */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetContent side="left" className="bg-background text-white">
                {/* Logo inside mobile menu */}
                <div className="flex items-center gap-2 mb-6">
                  <img
                    src={spenderellaLogo}
                    alt="Spenderella Logo"
                    className="w-10 h-10 object-contain"
                  />
                  <span className="text-lg font-bold">Spenderella</span>
                </div>
                <nav className="flex flex-col gap-y-1">
                  {routes.map((route) => (
                    <Button
                      key={route.href}
                      size="sm"
                      variant="ghost"
                      className={cn(
                        "w-full font-normal py-4.5 hover:bg-accent hover:text-white border-none text-white focus:bg-accent/70 transition !bg-transparent justify-start",
                        pathname === route.href && "bg-accent/50 text-white font-semibold"
                      )}
                      asChild
                      onClick={() => setIsOpen(false)}
                    >
                      <NavLink to={route.href}>{route.label}</NavLink>
                    </Button>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>

            {/* Right: User actions */}
            <div className="flex items-center space-x-2">
              <UserNav
                userName={user?.name || ""}
                profilePicture={user?.profilePicture || ""}
                onLogout={() => setIsLogoutDialogOpen(true)}
              />
            </div>
          </div>
        </div>
      </header>

      <LogoutDialog
        isOpen={isLogoutDialogOpen}
        setIsOpen={setIsLogoutDialogOpen}
      />
    </>
  );
};

export default Navbar;
