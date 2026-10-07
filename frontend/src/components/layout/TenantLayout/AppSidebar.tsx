import { useLocation, Link, useParams } from "react-router-dom"

import { ChevronDown, Layers, LayoutDashboard, Wrench } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { useContext, useState } from "react"
import { AuthContext } from "@/Contexts/AuthContext"
import { toast } from "@/components/ui/toast"
import { logout } from "@/api/endpoints"

const groupLabelClass =
  "mb-3 px-3 text-[9px] font-semibold uppercase tracking-[2px] text-sidebar-foreground/35 group-data-[collapsible=icon]:hidden"

const menuButtonClass =
  "h-10.25 rounded-lg px-3 text-[14px] font-medium text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-active:bg-sidebar-active data-active:text-sidebar-ring group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"

export function AppSidebar() {
  const { id } = useParams()
  const { pathname } = useLocation()
  const { userInfo } = useContext(AuthContext)
  const { isMobile, setOpenMobile } = useSidebar()

  const overviewActive =
    pathname === `/tenant/${id}/dashboard/` ||
    pathname.startsWith(`/tenant/${id}/dashboard/`)

  const branchActive =
    pathname === `/tenant/${id}/masters/branch` ||
    pathname.startsWith(`/tenant${id}/masters/branch/`)

  const [mastersOpen, setMastersOpen] = useState<boolean | undefined>(undefined)
  const showMasters = mastersOpen ?? branchActive

  /* Collapse the mobile sheet once a destination is picked. */
  const handleNavigate = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  const handleLogout = async () => {
    try {
      const data = await logout()
      if (data?.success) {
        toast.add({
          type: "success",
          description: data?.message,
        })
        setTimeout(() => {
          window.location.replace("/login")
        }, 1500)
      }
    } catch (err: any) {
      toast.add({
        type: "error",
        description: err?.response?.data?.message,
      })
    } finally {
    }
  }

  return (
    <Sidebar
      collapsible="icon"
      className="z-50 border-none bg-sidebar"
      style={
        {
          "--sidebar-width": "246px",
          "--sidebar-width-icon": "64px",
        } as React.CSSProperties
      }
    >
      {/* Logo */}

      <SidebarHeader className="h-20 border-b border-sidebar-border bg-sidebar p-0">
        <div className="flex h-full items-center px-4.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sidebar-ring shadow-md">
            <Wrench
              size={20}
              strokeWidth={2.5}
              className="text-sidebar-ring-foreground"
            />
          </div>

          <div className="ml-3 group-data-[collapsible=icon]:hidden">
            <h1 className="text-[16px] font-bold tracking-tight text-sidebar-foreground">
              redogroup
            </h1>

            <p className="mt-px text-[9px] font-medium tracking-[2px] text-sidebar-foreground/45 uppercase">
              Dealer Cockpit
            </p>
          </div>
        </div>
      </SidebarHeader>

      {/* Nav */}

      <SidebarContent className="space-y-7 px-2.5 py-5">
        <SidebarGroup className="p-0 first:mt-0">
          <SidebarGroupLabel className={groupLabelClass}>
            Tenant
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={overviewActive}
                  tooltip="Overview"
                  onClick={handleNavigate}
                  render={
                    <Link
                      to={`/tenant/${id}/dashboard/`}
                      aria-current={overviewActive ? "page" : undefined}
                    />
                  }
                  className={menuButtonClass}
                >
                  <LayoutDashboard
                    size={18}
                    strokeWidth={1.8}
                    className={
                      overviewActive
                        ? "text-sidebar-ring"
                        : "text-sidebar-foreground/55"
                    }
                  />

                  <span className="group-data-[collapsible=icon]:hidden">
                    Overview
                  </span>

                  {overviewActive && (
                    <span className="absolute right-3 h-1.5 w-1.5 rounded-full bg-sidebar-ring group-data-[collapsible=icon]:hidden" />
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={branchActive}
                  tooltip="Masters"
                  aria-expanded={showMasters}
                  onClick={() => setMastersOpen(!showMasters)}
                  className={menuButtonClass}
                >
                  <Layers
                    size={18}
                    strokeWidth={1.8}
                    className={
                      branchActive
                        ? "text-sidebar-ring"
                        : "text-sidebar-foreground/55"
                    }
                  />

                  <span className="group-data-[collapsible=icon]:hidden">
                    Masters
                  </span>

                  <ChevronDown
                    size={14}
                    className={cn(
                      "ml-auto text-sidebar-foreground/40 transition-transform duration-200 group-data-[collapsible=icon]:hidden",
                      showMasters && "rotate-180"
                    )}
                  />
                </SidebarMenuButton>

                {showMasters && (
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        isActive={branchActive}
                        onClick={handleNavigate}
                        render={
                          <Link
                            to={`/tenant/${id}/masters/branch`}
                            aria-current={branchActive ? "page" : undefined}
                          />
                        }
                      >
                        <span>Branch</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User footer */}

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                className="flex w-full items-center rounded-lg px-3 py-2.5 text-left transition group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 hover:bg-sidebar-accent"
              />
            }
          >
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="text-sidebar-ring-foreground bg-sidebar-ring text-xs font-bold">
                {userInfo?.email?.split("@")[0]?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="ml-3 min-w-0 group-data-[collapsible=icon]:hidden">
              <p className="truncate text-xs font-semibold text-sidebar-foreground">
                {userInfo?.email}
              </p>

              <p className="truncate text-[10px] text-sidebar-foreground/40">
                {userInfo?.role === "SUPER_ADMIN"
                  ? "Administrator"
                  : "Support Administrator"}
              </p>
            </div>

            <ChevronDown
              size={14}
              className="ml-auto text-sidebar-foreground/40 group-data-[collapsible=icon]:hidden"
            />
          </DropdownMenuTrigger>

          <DropdownMenuContent side="top" align="start" className="w-52">
            <DropdownMenuItem>Profile</DropdownMenuItem>

            <DropdownMenuItem>Account Settings</DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
