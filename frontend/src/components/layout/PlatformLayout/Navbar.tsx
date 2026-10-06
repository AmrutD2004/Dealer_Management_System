import { Bell, Moon, Search, Sun } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useLocation } from "react-router-dom";
import { useTheme } from "@/components/theme-provider";
import { cn } from "cn";

const iconButtonClass =
  "h-10 w-10 border-border bg-background text-muted-foreground shadow-sm hover:bg-muted";

export default function Navbar() {
  const { pathname } = useLocation();
  const {setTheme, theme} = useTheme()

  // const trail = getCrumbTrail(pathname);

  // const pageTitle = trail[trail.length - 1].label;

  return (
    <header className="fixed flex h-[80px] w-full items-center border-b border-border bg-background">
      <div className="flex w-full items-center justify-between px-6 lg:px-9">
        {/* Left: sidebar toggle + breadcrumb title */}

        <div className="flex items-center gap-4">
          <SidebarTrigger className="h-9 w-9 text-muted-foreground hover:bg-muted" />

          <Separator orientation="vertical" className="h-6" />

          <div>
            <h1 className="mt-1 text-[18px] font-semibold text-foreground">
              
            </h1>
          </div>
        </div>

        {/* Right: actions */}

        <div className="flex items-center gap-3 fixed right-0">
          <Button className={cn('px-2.5')} variant={'outline'} onClick={() => setTheme(theme==='light' ? 'dark' : 'light')}>
            {theme === 'light' ? <Moon /> : <Sun />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="Search"
            className={iconButtonClass}
          >
            <Search size={17} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Notifications"
            className="relative h-10 w-10 text-foreground"
          >
            <Bell size={17} />

            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#F8B52C]" />
          </Button>

          <Separator orientation="vertical" className="mx-1 h-8" />

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  className="h-10 w-10 rounded-full p-0"
                  aria-label="Account menu"
                />
              }
            >
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary text-xs font-bold text-primary-foreground">
                  AS
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>

              <DropdownMenuItem>Settings</DropdownMenuItem>

              <DropdownMenuItem className="text-red-600">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
