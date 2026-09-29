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

  {
    id: "2",
    tenantCode: "TEN-002",
    tenantName: "XYZ Auto Group",

    email: "amit@xyzauto.com",
    phone: "9876512345",
    gstNumber: "27AAAFG4567B1Z9",

    address: "FC Road",
    city: "Pune",
    state: "Maharashtra",
    country: "India",
    pincode: "411005",

    plan: "BASIC",
    subscriptionStatus: "TRIAL",
    isActive: true,

    createdAt: "2026-09-18",
    updatedAt: "2026-09-18",
  },

  {
    id: "3",
    tenantCode: "TEN-003",
    tenantName: "Star Motors",

    email: "rahul@starmotors.com",
    phone: "9123456789",
    gstNumber: "27AAAHK7890C1Z2",

    address: "Baner Road",
    city: "Pune",
    state: "Maharashtra",
    country: "India",
    pincode: "411045",

    plan: "PREMIUM",
    subscriptionStatus: "SUSPENDED",
    isActive: false,

    createdAt: "2026-07-20",
    updatedAt: "2026-09-10",
  },

  {
    id: "4",
    tenantCode: "TEN-004",
    tenantName: "Sunrise Automobiles",

    email: "vikram@sunriseauto.com",
    phone: "9988766554",
    gstNumber: "27AAFSD1122D1Z3",

    address: "Aundh Road",
    city: "Pune",
    state: "Maharashtra",
    country: "India",
    pincode: "411007",

    plan: "PRO",
    subscriptionStatus: "ACTIVE",
    isActive: true,

    createdAt: "2026-08-25",
    updatedAt: "2026-08-25",
  },

  {
    id: "5",
    tenantCode: "TEN-005",
    tenantName: "Prime Auto Works",

    email: "sandeep@primeauto.com",
    phone: "9765432109",
    gstNumber: "27AAAPQ3434E1Z6",

    address: "Pimpri Main Road",
    city: "Pimpri",
    state: "Maharashtra",
    country: "India",
    pincode: "411018",

    plan: "BASIC",
    subscriptionStatus: "EXPIRED",
    isActive: true,

    createdAt: "2026-06-10",
    updatedAt: "2026-09-10",
  },

  {
    id: "6",
    tenantCode: "TEN-006",
    tenantName: "Metro Car Care",

    email: "nikhil@metrocarcare.com",
    phone: "9876123456",
    gstNumber: "27AAAMN5656F1Z8",

    address: "Wakad",
    city: "Pune",
    state: "Maharashtra",
    country: "India",
    pincode: "411057",

    plan: "PRO",
    subscriptionStatus: "ACTIVE",
    isActive: true,

    createdAt: "2026-09-01",
    updatedAt: "2026-09-01",
  },
];