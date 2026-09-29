import type { Tenant } from "./types";

export const initialTenants: Tenant[] = [
  {
    id: "1",
    tenantCode: "TEN-001",
    tenantName: "ABC Motors Pvt Ltd",

    email: "rajesh@abcmotors.com",
    phone: "9876543210",
    gstNumber: "27AAECA1234A1Z5",

    address: "MG Road",
    city: "Pune",
    state: "Maharashtra",
    country: "India",
    pincode: "411001",

    plan: "PRO",
    subscriptionStatus: "ACTIVE",
    isActive: true,

    createdAt: "2026-08-12",
    updatedAt: "2026-08-12",
  },
];