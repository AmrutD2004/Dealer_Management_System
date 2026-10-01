
import type { Plan } from "./types";

const getToday = (): string => new Date().toISOString().split("T")[0];



const today = getToday();

export const initialPlans: Plan[] = [
  {
    id: "plan-basic",

    code: "BASIC",

    name: "Basic",
    description: "For a single dealership workshop getting started on the DMS.",

    price: 4999,
    billingCycle: "MONTHLY",

    features: [
      "1 workshop bay dashboard",
      "Job card creation and tracking",
      "Customer and vehicle records",
      "Basic inventory list",
      "Email support",
    ],

    maxBranches: 1,
    maxUsers: 5,
    maxVehicles: 100,

    storageGb: 25,

    isActive: true,
    isPopular: false,

    createdAt: today,
    updatedAt: today,
  },
  {
    id: "plan-pro",

    code: "PRO",

    name: "Pro",
    description: "For multi-bay workshops that need workshop and inventory control.",

    price: 12999,
    billingCycle: "MONTHLY",

    features: [
      "Everything in Basic",
      "Multiple workshop bays",
      "Inventory purchase and issue",
      "Job card approval workflow",
      "Reports and analytics",
      "Priority support",
    ],

    maxBranches: 5,
    maxUsers: 25,
    maxVehicles: 1000,

    storageGb: 250,

    isActive: true,
    isPopular: true,

    createdAt: today,
    updatedAt: today,
  },
  {
    id: "plan-premium",

    code: "PREMIUM",

    name: "Premium",
    description: "For dealer groups running several branches without any ceiling.",

    price: 24999,
    billingCycle: "MONTHLY",

    features: [
      "Everything in Pro",
      "Unlimited branches and vehicles",
      "Multi-branch stock transfers",
      "Custom reports and API access",
      "Dedicated account manager",
      "24x7 support",
    ],

    maxBranches: null,
    maxUsers: null,
    maxVehicles: null,

    storageGb: 1000,

    isActive: true,
    isPopular: false,

    createdAt: today,
    updatedAt: today,
  },
];
