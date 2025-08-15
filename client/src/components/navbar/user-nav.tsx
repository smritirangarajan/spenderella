import { ChevronDown, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type UserNavProps = {
  userName: string;
  profilePicture: string;
  onLogout: () => void;
};

export function UserNav({ userName, profilePicture, onLogout }: UserNavProps) {
  const initial = userName?.trim()?.charAt(0)?.toUpperCase() || "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative !bg-transparent h-9 w-9 rounded-full !gap-0 p-0"
          aria-label="Open user menu"
        >
          <Avatar className="h-9 w-9 !cursor-pointer">
            <AvatarImage src={profilePicture || ""} alt={userName || "User"} />
            <AvatarFallback
              className="!bg-[var(--secondary-dark-color)] border !border-gray-700 !text-white"
            >
              {initial}
            </AvatarFallback>
          </Avatar>
          <ChevronDown className="ml-1 size-3.5 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        forceMount
        className="w-56 !bg-[var(--secondary-dark-color)] !text-white !border-gray-700"
      >
        <DropdownMenuLabel className="flex flex-col items-start gap-1">
          <span className="font-semibold leading-none">{userName}</span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="!bg-gray-700" />

        <DropdownMenuGroup>
          <DropdownMenuItem
            className="gap-2 hover:!bg-gray-800 hover:!text-white"
            onSelect={(e) => {
              e.preventDefault();
              onLogout();
            }}
          >
            <LogOut className="size-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
