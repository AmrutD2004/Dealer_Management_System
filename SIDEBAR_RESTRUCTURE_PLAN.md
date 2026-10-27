# Sidebar Restructure Plan

## Current Issues

### Tenant Sidebar
- **Too flat and deep nesting**: "Masters" contains 13 items with Services nested 2 levels deep
- **Poor categorization**: HR, Organization, Services, Parts, and Security all mixed under "Masters"
- **Unclear naming**: "Assign Permission" is ambiguous, "Dealer's Bay" has awkward grammar
- **Cognitive overload**: Users need to dig through multiple levels to find common items
- **Inconsistent grouping**: Job Cards split into sub-items, but other major features could be better organized

### Platform Sidebar
- **Mixed concerns**: Platform Users, Tenants, and Catalog items in one flat list
- **Naming**: "Tenant Management" could just be "Tenants", "Permission Management" could be "Permissions"

## Proposed Structure

### Tenant Sidebar (Recommended)

```tsx
// Group 1: Operations (Daily Work)
{
  label: "Operations",
  items: [
    { title: "Overview", url: `/tenant/${id}/dashboard/`, icon: LayoutDashboard },
    { title: "Customers", url: `/tenant/${id}/customer`, icon: UserRound },
    { title: "Vehicles", url: `/tenant/${id}/vehicle`, icon: Car },
  ]
}

// Group 2: Workshop
{
  label: "Workshop",
  items: [
    { title: "Job Cards", url: `/tenant/${id}/job-card`, icon: ClipboardList },
    { title: "Allocations", url: `/tenant/${id}/job-card/allocation`, icon: CalendarClock },
  ]
}

// Group 3: Organization (Collapsible)
{
  label: "Organization",
  items: [ /* collapsible */ 
    { title: "Branches", url: `/tenant/${id}/masters/branch`, icon: Building2 },
    { title: "Designations", url: `/tenant/${id}/masters/designation`, icon: Briefcase },
    { title: "Employees", url: `/tenant/${id}/masters/employee`, icon: Users },
  ]
}

// Group 4: Access Control (Collapsible)
{
  label: "Access Control",
  items: [
    { title: "Roles", url: `/tenant/${id}/masters/role`, icon: ShieldCheck },
    { title: "Permissions", url: `/tenant/${id}/masters/permission`, icon: KeyRound },
  ]
}

// Group 5: Service Setup (Collapsible)
{
  label: "Service Setup",
  items: [
    { title: "Service Categories", url: `/tenant/${id}/masters/service-category`, icon: Tags },
    { title: "Service Types", url: `/tenant/${id}/masters/service-type`, icon: Boxes },
    { title: "Repair Orders", url: `/tenant/${id}/masters/repair-order`, icon: ClipboardList },
    { title: "Labour Rates", url: `/tenant/${id}/masters/labour`, icon: HardHat },
    { title: "Service Bays", url: `/tenant/${id}/masters/dealer-bay`, icon: Warehouse },
  ]
}

// Group 6: Parts & Inventory (Collapsible)
{
  label: "Parts & Inventory",
  items: [
    { title: "Part Categories", url: `/tenant/${id}/masters/part-category`, icon: Package },
    { title: "Parts Master", url: `/tenant/${id}/masters/part-master`, icon: PackageSearch },
    { title: "HSN Codes", url: `/tenant/${id}/masters/hsn`, icon: Percent },
    { title: "Part Fitments", url: `/tenant/${id}/masters/part-fitment`, icon: Link2 },
  ]
}
```

**Benefits:**
- Flatter hierarchy - max 1 level deep instead of 2
- Logical grouping by workflow (Operations → Workshop → Configuration)
- Better discoverability - related items together
- Cleaner naming (Permissions vs Assign Permission, Service Bays vs Dealer's Bay)
- Frequently used items (Customers, Vehicles, Job Cards) at top level

### Platform Sidebar (Recommended)

```tsx
{
  label: "Management",
  items: [
    { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
    { title: "Tenants", url: "/platform/tenant", icon: Building2 },
    { title: "Platform Users", url: "/platform-users", icon: ShieldCheck },
  ]
},
{
  label: "Access Control",
  items: [
    { title: "Permissions", url: "/platform/permission", icon: KeyRound },
  ]
},
{
  label: "Vehicle Catalog",
  items: [
    { title: "Brands", url: "/platform/brand", icon: Tag },
    { title: "Models", url: "/platform/model", icon: Car },
    { title: "Variants", url: "/platform/variant", icon: Layers },
  ]
}
```

**Benefits:**
- Grouped by purpose
- Cleaner, shorter labels
- Better visual hierarchy

## Implementation Details

### Changes needed:

**TenantLayout/AppSidebar.tsx:**
1. Update imports - add `Building2`, `Settings` if needed; replace `Key` with `KeyRound`
2. Remove old state: `mastersOpen`, `servicesOpen`
3. Add new state: `orgOpen`, `accessOpen`, `serviceSetupOpen`, `partsOpen` with smart defaults based on active routes
4. Replace the entire `<SidebarContent>` with new grouped structure
5. Update active route detection logic
6. Remove nested Services submenu - flatten to direct items under Service Setup

**PlatformLayout/AppSidebar.tsx:**
1. Reorganize `navGroups` into logical groups
2. Update labels and potentially add grouping structure
3. Consider adding group separators for visual clarity

## Migration Notes
- All routes remain the same - only UI structure changes
- Active states preserved for all existing routes
- Mobile behavior unchanged (auto-close on navigate)
- Collapsed icon mode still works
- No breaking changes to functionality
