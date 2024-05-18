"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Moon, Settings, Sun, TruckIcon } from "lucide-react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useState } from "react";
import { Switch } from "../ui/switch";
import { useRouter } from "next/navigation";

interface Props {
  user: Session | null;
}

const UserButton = ({ user }: Session) => {
  const { setTheme, theme } = useTheme();
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  function setSwitchState() {
    switch (theme) {
      case "dark":
        return setChecked(true);
      case "light":
        return setChecked(false);
      case "system":
        return setChecked(false);
    }
  }
  if (user)
    return (
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger>
          <Avatar>
            {user.image && (
              <Image src={user.image} alt={user.name!} fill={true} />
            )}
            {!user.image && (
              <AvatarFallback className="bg-primary/25">
                <div className="font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              </AvatarFallback>
            )}
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 p-6" align="end">
          <div className="mb-4 p-4 flex flex-col items-center gap-1 ">
            {user.image ? (
              <Image
                className="rounded-full"
                src={user.image}
                alt={user.name!}
                width={36}
                height={36}
              />
            ) : (
              <Avatar>
                <AvatarFallback className="bg-primary/25">
                  <div className="font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                </AvatarFallback>
              </Avatar>
            )}
            <p className="font-bold text-xs">{user.name}</p>
            <span className="font-medium text-xs text-secondary-foreground">
              {user.email}
            </span>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => router.push("/dashboard/order")}
            className="py-2 font-medium cursor-pointer transition-all duration-500"
          >
            <TruckIcon size={14} className="mr-1" />
            My Orders
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push("/dashboard/settings")}
            className="py-2 font-medium cursor-pointer transition-all duration-500"
          >
            <Settings size={14} className="mr-1" /> Settings
          </DropdownMenuItem>
          <DropdownMenuItem className="py-2 font-medium cursor-pointer transition-all duration-500">
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center group"
            >
              <div className="relative flex mr-2">
                <Sun
                  size={14}
                  className=" absolute group-hover:text-yellow-600 dark:scale-0"
                />
                <Moon
                  size={14}
                  className=" group-hover:text-blue-400 dark:scale-100 scale-0"
                />
              </div>

              <p className="dark:text-blue-400 text-secondary-foreground/75 text-yellow-600 ">
                {theme!} Mode
              </p>
              <Switch
                className="scale-75 ml-3"
                checked={checked}
                onCheckedChange={(e) => {
                  setChecked((prev) => !prev);
                  // console.log(e);
                  e === true ? setTheme("dark") : setTheme("light");
                }}
              />
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="py-2 font-medium focus:bg-destructive/50 cursor-pointer transition-all duration-500"
            onClick={() => signOut()}
          >
            <LogOut size={14} className="mr-1" /> Sign-Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
};

export default UserButton;
