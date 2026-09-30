import { useLocation, Link } from "react-router-dom";

import {
  Building2,
  ChevronDown,
  LayoutDashboard,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

const navGroups: Array<{ label: string; items: NavItem[] }> = [
  // {
  //   label: "Workspace",
  //   items: [
  //     { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
  //     { title: "Job Cards", url: "/job-cards", icon: ClipboardList },
  //     { title: "Customers", url: "/customers", icon: Users },
  //     { title: "Vehicles", url: "/vehicles", icon: Car },
  //     { title: "Setup", url: "/setup", icon: SlidersHorizontal },
  //   ],
  // },
  // {
  //   label: "Operations",
  //   items: [
  //     { title: "Workshop", url: "/workshop", icon: Wrench },
  //     { title: "Inventory", url: "/inventory", icon: Package },
  //     { title: "Reports", url: "/reports", icon: FileText },
  //     { title: "Settings", url: "/settings", icon: Settings },
  //   ],
  // },
  {
    label: "Platform",
    items: [
      { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
      { title: "Tenant Management", url: "/tenants", icon: Building2 },
      // { title: "Subscription Plans", url: "/plans", icon: CreditCard },
    ],
  },
];

const groupLabelClass =
  "mb-3 px-3 text-[9px] font-semibold uppercase tracking-[2px] text-white/35 group-data-[collapsible=icon]:hidden";

const menuButtonClass =
  "h-10.25 rounded-lg px-3 text-[14px] font-medium text-white/60 hover:bg-white/5 hover:text-white data-active:bg-[#294658] data-active:text-[#F8B52C] group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0";

function NavGroup({
  label,
  items,
  pathname,
  onNavigate,
}: {
  label: string;
  items: NavItem[];
  pathname: string;
  onNavigate: () => void;
}) {
  return (
    <SidebarGroup className="p-0 first:mt-0">
      <SidebarGroupLabel className={groupLabelClass}>
        {label}
      </SidebarGroupLabel>

      <SidebarGroupContent>
        <SidebarMenu className="gap-1">
          {items.map((item) => {
            const isActive =
              pathname === item.url || pathname.startsWith(`${item.url}/`);

            const Icon = item.icon;

            return (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton
                  isActive={isActive}
                  tooltip={item.title}
                  onClick={onNavigate}
                  render={
                    <Link
                      to={item.url}
                      aria-current={isActive ? "page" : undefined}
                    />
                  }
                  className={menuButtonClass}
                >
                  <Icon
                    size={18}
                    strokeWidth={1.8}
                    className={isActive ? "text-[#F8B52C]" : "text-white/55"}
                  />

                  <span className="group-data-[collapsible=icon]:hidden">
                    {item.title}
                  </span>

                  {isActive && (
                    <span className="absolute right-3 h-1.5 w-1.5 rounded-full bg-[#F8B52C] group-data-[collapsible=icon]:hidden" />
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function AppSidebar() {
  const { pathname } = useLocation();

  const { isMobile, setOpenMobile } = useSidebar();

  /* Collapse the mobile sheet once a destination is picked. */
  const handleNavigate = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-none z-50"
      style={
        {
          "--sidebar-width": "246px",
          "--sidebar-width-icon": "64px",
        } as React.CSSProperties
      }
    >
      {/* Logo */}

      <SidebarHeader className="h-20 border-b border-white/10 bg-[#19303D] p-0">
        <div className="flex h-full items-center px-4.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F8B52C] shadow-md">
            <Wrench size={20} strokeWidth={2.5} className="text-[#19303D]" />
          </div>

          <div className="ml-3 group-data-[collapsible=icon]:hidden">
            <h1 className="text-[16px] font-bold tracking-tight text-white">
              redogroup
            </h1>

            <p className="mt-px text-[9px] font-medium uppercase tracking-[2px] text-white/45">
              Dealer Cockpit
            </p>
          </div>
        </div>
      </SidebarHeader>

      {/* Nav */}

      <SidebarContent className="space-y-7 bg-[#19303D] px-2.5 py-5">
        {navGroups.map((group) => (
          <NavGroup
            key={group.label}
            label={group.label}
            items={group.items}
            pathname={pathname}
            onNavigate={handleNavigate}
          />
        ))}
      </SidebarContent>

      {/* User footer */}

      <SidebarFooter className="border-t border-white/10 bg-[#19303D] p-3">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                className="flex w-full items-center rounded-lg px-3 py-2.5 text-left transition hover:bg-white/4 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
              />
            }
          >
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="bg-[#277EA3] text-xs font-bold text-white">
                AS
              </AvatarFallback>
            </Avatar>

            <div className="ml-3 min-w-0 group-data-[collapsible=icon]:hidden">
              <p className="truncate text-xs font-semibold text-white">
                Admin User
              </p>

              <p className="truncate text-[10px] text-white/40">
                Administrator
              </p>
            </div>

            <ChevronDown
              size={14}
              className="ml-auto text-white/40 group-data-[collapsible=icon]:hidden"
            />
          </DropdownMenuTrigger>

          <DropdownMenuContent side="top" align="start" className="w-52">
            <DropdownMenuItem>Profile</DropdownMenuItem>

            <DropdownMenuItem>Account Settings</DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="text-red-600">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
