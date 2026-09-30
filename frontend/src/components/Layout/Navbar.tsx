import { Bell, Search } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

const iconButtonClass =
  "h-10 w-10 border-[#DEDAD4] bg-white text-[#71818B] shadow-sm hover:bg-[#F7F6F3]";

const breadcrumbLinkClass =
  "text-[9px] font-semibold uppercase tracking-[2px] text-[#087EAE]";

const breadcrumbPageClass =
  "text-[9px] font-semibold uppercase tracking-[2px] text-[#71818B]";

interface Crumb {
  label: string;

  /* Present only on crumbs that are links to an ancestor page. */
  to?: string;
}

const PLATFORM: Crumb = { label: "Platform", to: "/dashboard" };

/*
 * The title and the breadcrumb both come from this trail, so adding a
 * page means adding one entry here rather than another conditional.
 */

const getCrumbTrail = (pathname: string): Crumb[] => {
  switch (pathname) {
    case "/tenants":
      return [PLATFORM, { label: "Tenant Management" }];

    case "/tenants/create":
      return [
        PLATFORM,
        { label: "Tenant Management", to: "/tenants" },
        { label: "Create Tenant" },
      ];

    case "/plans":
      return [PLATFORM, { label: "Subscription Plans" }];

    default:
      return [PLATFORM, { label: "Overview" }];
  }
};

export default function Navbar() {
  const { pathname } = useLocation();

  const trail = getCrumbTrail(pathname);

  const pageTitle = trail[trail.length - 1].label;

  return (
    <header className="fixed flex h-20 w-full items-center border-b border-[#E4E0DA] bg-[#FBFAF8]">
      <div className="flex w-full items-center justify-between px-6 lg:px-9">
        {/* Left: sidebar toggle + breadcrumb title */}

        <div className="flex items-center gap-4">
          <SidebarTrigger className="h-9 w-9 text-[#52636C] hover:bg-[#F2F0EC]" />

          <Separator orientation="vertical" className="h-6" />

          <div>
            <Breadcrumb>
              <BreadcrumbList>
                {trail.map((crumb, index) => {
                  const isFirst = index === 0;

                  const isLast = index === trail.length - 1;

                  return (
                    <BreadcrumbItem key={crumb.label}>
                      {!isFirst && <BreadcrumbSeparator />}

                      {crumb.to && !isLast ? (
                        <BreadcrumbLink
                          className={breadcrumbLinkClass}
                          render={<Link to={crumb.to} />}
                        >
                          {crumb.label}
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage className={breadcrumbPageClass}>
                          {crumb.label}
                        </BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>

            <h1 className="mt-1 text-[18px] font-semibold text-[#1C2B34]">
              {pageTitle}
            </h1>
          </div>
        </div>

        {/* Right: actions */}

        <div className="flex items-center gap-3 fixed right-0">
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
            className="relative h-10 w-10 text-[#71818B] hover:bg-[#F2F0EC]"
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
                <AvatarFallback className="bg-[#277EA3] text-[11px] font-bold text-white">
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
