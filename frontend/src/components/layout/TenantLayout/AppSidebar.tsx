import { useLocation, Link, useParams } from "react-router-dom"

import { Boxes, Briefcase, Building, CalendarClock, Car, ChevronDown, ClipboardList, FileText, HardHat, Key, Layers, LayoutDashboard, Link2, Package, PackageSearch, Percent, ShieldCheck, Tags, Users, UserRound, Warehouse, Wrench } from "lucide-react"

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

  const customerActive =
    pathname === `/tenant/${id}/customer` ||
    pathname.startsWith(`/tenant/${id}/customer/`)

  const vehicleActive =
    pathname === `/tenant/${id}/vehicle` ||
    pathname.startsWith(`/tenant/${id}/vehicle/`)

  const serviceQuotationActive =
    pathname === `/tenant/${id}/service-quotation` ||
    pathname.startsWith(`/tenant/${id}/service-quotation/`)

  const jobCardAllocationActive =
    pathname === `/tenant/${id}/job-card/allocation` ||
    pathname.startsWith(`/tenant/${id}/job-card/allocation/`)

  const jobCardListActive =
    (pathname === `/tenant/${id}/job-card` ||
      pathname.startsWith(`/tenant/${id}/job-card/`)) &&
    !jobCardAllocationActive

  const jobCardActive = jobCardListActive || jobCardAllocationActive

  const branchActive =
    pathname === `/tenant/${id}/masters/branch` ||
    pathname.startsWith(`/tenant${id}/masters/branch/`)

  const designationActive =
    pathname === `/tenant/${id}/masters/designation` ||
    pathname.startsWith(`/tenant/${id}/masters/designation/`)

  const roleActive =
    pathname === `/tenant/${id}/masters/role` ||
    pathname.startsWith(`/tenant/${id}/masters/role/`)
  
    const assignPermission =
    pathname === `/tenant/${id}/masters/permission` ||
    pathname.startsWith(`/tenant/${id}/masters/permission`)

  const employeeActive =
    pathname === `/tenant/${id}/masters/employee` ||
    pathname.startsWith(`/tenant/${id}/masters/employee/`)

  const serviceCategoryActive =
    pathname === `/tenant/${id}/masters/service-category` ||
    pathname.startsWith(`/tenant/${id}/masters/service-category/`)

  const serviceTypeActive =
    pathname === `/tenant/${id}/masters/service-type` ||
    pathname.startsWith(`/tenant/${id}/masters/service-type/`)

  const repairOrderActive =
    pathname === `/tenant/${id}/masters/repair-order` ||
    pathname.startsWith(`/tenant/${id}/masters/repair-order/`)

  const labourActive =
    pathname === `/tenant/${id}/masters/labour` ||
    pathname.startsWith(`/tenant/${id}/masters/labour/`)

  const partCategoryActive =
    pathname === `/tenant/${id}/masters/part-category` ||
    pathname.startsWith(`/tenant/${id}/masters/part-category/`)

  const partMasterActive =
    pathname === `/tenant/${id}/masters/part-master` ||
    pathname.startsWith(`/tenant/${id}/masters/part-master/`)

  const hsnActive =
    pathname === `/tenant/${id}/masters/hsn` ||
    pathname.startsWith(`/tenant/${id}/masters/hsn/`)

  const partFitmentActive =
    pathname === `/tenant/${id}/masters/part-fitment` ||
    pathname.startsWith(`/tenant/${id}/masters/part-fitment/`)

  const dealerBayActive =
    pathname === `/tenant/${id}/masters/dealer-bay` ||
    pathname.startsWith(`/tenant/${id}/masters/dealer-bay/`)

  const servicesActive = serviceCategoryActive || serviceTypeActive

  const [mastersOpen, setMastersOpen] = useState<boolean | undefined>(undefined)
  const showMasters = mastersOpen ?? (branchActive || designationActive || roleActive || assignPermission || employeeActive || servicesActive || repairOrderActive || labourActive || partCategoryActive || partMasterActive || hsnActive || partFitmentActive || dealerBayActive)

  const [servicesOpen, setServicesOpen] = useState<boolean | undefined>(undefined)
  const showServices = servicesOpen ?? servicesActive

  const [jobCardsOpen, setJobCardsOpen] = useState<boolean | undefined>(undefined)
  const showJobCards = jobCardsOpen ?? jobCardActive

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
                  isActive={customerActive}
                  tooltip="Customer"
                  onClick={handleNavigate}
                  render={
                    <Link
                      to={`/tenant/${id}/customer`}
                      aria-current={customerActive ? "page" : undefined}
                    />
                  }
                  className={menuButtonClass}
                >
                  <UserRound
                    size={18}
                    strokeWidth={1.8}
                    className={
                      customerActive
                        ? "text-sidebar-ring"
                        : "text-sidebar-foreground/55"
                    }
                  />

                  <span className="group-data-[collapsible=icon]:hidden">
                    Customer
                  </span>

                  {customerActive && (
                    <span className="absolute right-3 h-1.5 w-1.5 rounded-full bg-sidebar-ring group-data-[collapsible=icon]:hidden" />
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={vehicleActive}
                  tooltip="Vehicle"
                  onClick={handleNavigate}
                  render={
                    <Link
                      to={`/tenant/${id}/vehicle`}
                      aria-current={vehicleActive ? "page" : undefined}
                    />
                  }
                  className={menuButtonClass}
                >
                  <Car
                    size={18}
                    strokeWidth={1.8}
                    className={
                      vehicleActive
                        ? "text-sidebar-ring"
                        : "text-sidebar-foreground/55"
                    }
                  />

                  <span className="group-data-[collapsible=icon]:hidden">
                    Vehicle
                  </span>

                  {vehicleActive && (
                    <span className="absolute right-3 h-1.5 w-1.5 rounded-full bg-sidebar-ring group-data-[collapsible=icon]:hidden" />
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={jobCardActive}
                  tooltip="Job Card"
                  aria-expanded={showJobCards}
                  onClick={() => setJobCardsOpen(!showJobCards)}
                  className={menuButtonClass}
                >
                  <ClipboardList
                    size={18}
                    strokeWidth={1.8}
                    className={
                      jobCardActive
                        ? "text-sidebar-ring"
                        : "text-sidebar-foreground/55"
                    }
                  />

                  <span className="group-data-[collapsible=icon]:hidden">
                    Job Card
                  </span>

                  <ChevronDown
                    size={14}
                    className={cn(
                      "ml-auto text-sidebar-foreground/40 transition-transform duration-200 group-data-[collapsible=icon]:hidden",
                      showJobCards && "rotate-180"
                    )}
                  />
                </SidebarMenuButton>

                {showJobCards && (
                  <SidebarMenuSub className="mt-1">
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        isActive={jobCardListActive}
                        onClick={handleNavigate}
                        render={
                          <Link
                            to={`/tenant/${id}/job-card`}
                            aria-current={jobCardListActive ? "page" : undefined}
                          />
                        }
                      >
                        <span className="flex items-center gap-2 "><ClipboardList size={18}/>Job Cards</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        isActive={jobCardAllocationActive}
                        onClick={handleNavigate}
                        render={
                          <Link
                            to={`/tenant/${id}/job-card/allocation`}
                            aria-current={jobCardAllocationActive ? "page" : undefined}
                          />
                        }
                      >
                        <span className="flex items-center gap-2 "><CalendarClock size={18}/>Allocations</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={serviceQuotationActive}
                  tooltip="Service Quotation"
                  onClick={handleNavigate}
                  render={
                    <Link
                      to={`/tenant/${id}/service-quotation`}
                      aria-current={serviceQuotationActive ? "page" : undefined}
                    />
                  }
                  className={menuButtonClass}
                >
                  <FileText
                    size={18}
                    strokeWidth={1.8}
                    className={
                      serviceQuotationActive
                        ? "text-sidebar-ring"
                        : "text-sidebar-foreground/55"
                    }
                  />

                  <span className="group-data-[collapsible=icon]:hidden">
                    Service Quotation
                  </span>

                  {serviceQuotationActive && (
                    <span className="absolute right-3 h-1.5 w-1.5 rounded-full bg-sidebar-ring group-data-[collapsible=icon]:hidden" />
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={branchActive || designationActive || roleActive || assignPermission || employeeActive || servicesActive || repairOrderActive || labourActive || partCategoryActive || partMasterActive || hsnActive || partFitmentActive || dealerBayActive}
                  tooltip="Masters"
                  aria-expanded={showMasters}
                  onClick={() => setMastersOpen(!showMasters)}
                  className={menuButtonClass}
                >
                  <Layers
                    size={18}
                    strokeWidth={1.8}
                    className={
                      branchActive || designationActive || roleActive || assignPermission || employeeActive || servicesActive || repairOrderActive || labourActive || partCategoryActive || partMasterActive || hsnActive || partFitmentActive || dealerBayActive
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
                  <SidebarMenuSub className="mt-1 ">
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
                        <span className="flex items-center gap-2 "><Building size={18}/>Branch</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        isActive={designationActive}
                        onClick={handleNavigate}
                        render={
                          <Link
                            to={`/tenant/${id}/masters/designation`}
                            aria-current={designationActive ? "page" : undefined}
                          />
                        }
                      >
                        <span className="flex items-center gap-2 "><Briefcase size={18}/>Designation</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        isActive={roleActive}
                        onClick={handleNavigate}
                        render={
                          <Link
                            to={`/tenant/${id}/masters/role`}
                            aria-current={roleActive ? "page" : undefined}
                          />
                        }
                      >
                        <span className="flex items-center gap-2 "><ShieldCheck size={18}/>Role</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        isActive={assignPermission}
                        onClick={handleNavigate}
                        render={
                          <Link
                            to={`/tenant/${id}/masters/permission`}
                            aria-current={assignPermission ? "page" : undefined}
                          />
                        }
                      >
                        <span className="flex items-center gap-2 "><Key size={18}/>Assign Permission</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        isActive={employeeActive}
                        onClick={handleNavigate}
                        render={
                          <Link
                            to={`/tenant/${id}/masters/employee`}
                            aria-current={employeeActive ? "page" : undefined}
                          />
                        }
                      >
                        <span className="flex items-center gap-2 "><Users size={18}/>Employee</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        isActive={servicesActive}
                        aria-expanded={showServices}
                        onClick={() => setServicesOpen(!showServices)}
                        render={<button type="button" />}
                      >
                        <span className="flex items-center gap-2 "><Wrench size={18}/>Services</span>
                        <ChevronDown
                          size={14}
                          className={cn(
                            "ml-auto text-sidebar-foreground/40 transition-transform duration-200",
                            showServices && "rotate-180"
                          )}
                        />
                      </SidebarMenuSubButton>

                      {showServices && (
                        <SidebarMenuSub className="mt-1">
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              isActive={serviceCategoryActive}
                              onClick={handleNavigate}
                              render={
                                <Link
                                  to={`/tenant/${id}/masters/service-category`}
                                  aria-current={serviceCategoryActive ? "page" : undefined}
                                />
                              }
                            >
                              <span className="flex items-center gap-2 "><Tags size={18}/>Service Category</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              isActive={serviceTypeActive}
                              onClick={handleNavigate}
                              render={
                                <Link
                                  to={`/tenant/${id}/masters/service-type`}
                                  aria-current={serviceTypeActive ? "page" : undefined}
                                />
                              }
                            >
                              <span className="flex items-center gap-2 "><Boxes size={18}/>Service Type</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      )}
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        isActive={repairOrderActive}
                        onClick={handleNavigate}
                        render={
                          <Link
                            to={`/tenant/${id}/masters/repair-order`}
                            aria-current={repairOrderActive ? "page" : undefined}
                          />
                        }
                      >
                        <span className="flex items-center gap-2 "><ClipboardList size={18}/>Repair Order</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        isActive={labourActive}
                        onClick={handleNavigate}
                        render={
                          <Link
                            to={`/tenant/${id}/masters/labour`}
                            aria-current={labourActive ? "page" : undefined}
                          />
                        }
                      >
                        <span className="flex items-center gap-2 "><HardHat size={18}/>Labour</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        isActive={partCategoryActive}
                        onClick={handleNavigate}
                        render={
                          <Link
                            to={`/tenant/${id}/masters/part-category`}
                            aria-current={partCategoryActive ? "page" : undefined}
                          />
                        }
                      >
                        <span className="flex items-center gap-2 "><Package size={18}/>Part Category</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        isActive={partMasterActive}
                        onClick={handleNavigate}
                        render={
                          <Link
                            to={`/tenant/${id}/masters/part-master`}
                            aria-current={partMasterActive ? "page" : undefined}
                          />
                        }
                      >
                        <span className="flex items-center gap-2 "><PackageSearch size={18}/>Part Master</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        isActive={hsnActive}
                        onClick={handleNavigate}
                        render={
                          <Link
                            to={`/tenant/${id}/masters/hsn`}
                            aria-current={hsnActive ? "page" : undefined}
                          />
                        }
                      >
                        <span className="flex items-center gap-2 "><Percent size={18}/>HSN</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        isActive={partFitmentActive}
                        onClick={handleNavigate}
                        render={
                          <Link
                            to={`/tenant/${id}/masters/part-fitment`}
                            aria-current={partFitmentActive ? "page" : undefined}
                          />
                        }
                      >
                        <span className="flex items-center gap-2 "><Link2 size={18}/>Part Fitment</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        isActive={dealerBayActive}
                        onClick={handleNavigate}
                        render={
                          <Link
                            to={`/tenant/${id}/masters/dealer-bay`}
                            aria-current={dealerBayActive ? "page" : undefined}
                          />
                        }
                      >
                        <span className="flex items-center gap-2 "><Warehouse size={18}/>Dealer's Bay</span>
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
                {userInfo?.role?.roleName}
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
