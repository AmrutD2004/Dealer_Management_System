import type { PlatformUser } from "./types";

export const initialPlatformUsers: PlatformUser[] = [
  {
    id: "1",
    userCode: "PU-001",

    firstName: "Aarav",
    middleName: "",
    lastName: "Sharma",

    email: "aarav.sharma@redogroup.com",
    phone: "9876543210",

    role: "SUPER_ADMIN",
    status: "ACTIVE",

    lastLoginAt: "2026-09-28T09:15:00.000Z",

    createdAt: "2026-01-10",
    updatedAt: "2026-09-28",
  },
  {
    id: "2",
    userCode: "PU-002",

    firstName: "Meera",
    middleName: "",
    lastName: "Nair",

    email: "meera.nair@redogroup.com",
    phone: "9876500011",

    role: "SUPPORT_ADMIN",
    status: "ACTIVE",

    lastLoginAt: "2026-09-27T16:40:00.000Z",

    createdAt: "2026-03-04",
    updatedAt: "2026-09-20",
  },
  {
    id: "3",
    userCode: "PU-003",

    firstName: "Rohan",
    middleName: "Kumar",
    lastName: "Iyer",

    email: "rohan.iyer@redogroup.com",
    phone: "9876500022",

    role: "SUPPORT_ADMIN",
    status: "INACTIVE",

    lastLoginAt: null,

    createdAt: "2026-06-18",
    updatedAt: "2026-08-30",
  },
];
