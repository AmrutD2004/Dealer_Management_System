# Backend workflow: platform user to job card and customer voices

## Purpose and scope

This document follows the backend path from a platform user setting up a tenant, through tenant-user login and the creation of a job card with its customer voice entries. Backend routes are mounted under `/api`. Job card creation is a tenant operation: the platform user provisions the tenant and its first administrator, then that tenant user creates the job card.

Relevant files include `src/server.ts` (route mounting), the auth route/controller and middleware, platform tenant management, tenant routes, the job card and labour controllers, and `src/prisma/schema.prisma` (models and relationships).

## 1. Platform user signs in

The unified login endpoint is `POST /api/auth/login`. It accepts an email and password. The login controller first looks for the email in `platform_users`. For an active matching account, it compares the submitted password with the stored hash. On success, it issues an authentication cookie containing a token with the platform user ID, email, role, and `PLATFORM_USER` type.

If that lookup does not result in a successful platform login, the controller checks the tenant `Users` table. On a successful tenant login, it updates `lastLoginAt` and issues a token carrying the tenant user's ID, tenant ID, branch ID, role code, and `TENANT_USER` type.

## 2. Platform user provisions the tenant and its first administrator

The platform user calls `POST /api/platform/tenant/create`. The route applies `authenticate` and `requirePlatformUser`. The controller checks the platform role/type, validates tenant, initial branch, and first administrator fields, and rejects duplicate tenant or user emails.

Tenant setup is one Prisma transaction. It inserts, in order:

1. A `Tenant` row, with `createdBy` set to the platform user's ID.
2. The initial `Branch`, linked to that tenant.
3. A default tenant `Role` with code `ADMIN`.
4. An `EmployeeDesignation` with code `TENANT_ADMIN`.
5. The first tenant administrator in `Users`, linked to the tenant, branch, role, and designation. The password is bcrypt-hashed before it is stored.

These setup records commit together or roll back together if an operation fails. The platform user does not create job cards through the platform routes; the tenant administrator signs in as a tenant user to use tenant routes.

## 3. Tenant user prepares referenced records

Job cards refer to existing records. The tenant must have a branch, customer, vehicle, service category, service type, repair order type, and labour records available. The customer and vehicle routes are in the tenant router. Labour records are managed at `POST /api/tenant/labour/create`; the handler assigns the authenticated tenant ID to the new `LabourMaster` row and uses a tenant-scoped unique labour code.

Each customer voice has a `labourId`. The job card controller stores that value as `JobCardCustomerVoice.actionToBeTaken`, a foreign key to `LabourMaster.id`. Job card creation does not create labour records; the referenced labour must already exist.

## 4. Tenant user creates the job card

The endpoint is `POST /api/tenant/jobcard/create`. The tenant route applies `authenticate`, then `requireTenantUser`, before calling `createJobCard`.

The authentication middleware verifies the token cookie and attaches its claims to `req.user`. The tenant-only guard rejects a platform token. The controller takes the creator ID and tenant ID from `req.user`, rather than accepting those values from the request body.

The controller requires branch, current odometer reading, customer, estimated close time, repair order type, service category, service type, vehicle, vehicle status, and a `customerVoices` value. It generates a number in the form `JC-BR<branchId>-<fiscalYear>-<five-digit-sequence>`, using the India fiscal-year helper. It looks up the latest number for that tenant, branch, and prefix to calculate the next sequence.

The controller checks for an existing open job card using the candidate number and `OPEN` status. If it finds one, it returns an error. Otherwise one Prisma transaction performs both writes:

1. Insert a `JobCard` row. It stores the authenticated tenant and creator IDs, the submitted branch/customer/vehicle/service IDs and job details, and starts with status `OPEN`. Optional values are stored as null when absent; supervisor and technician IDs are converted to numbers when supplied.
2. Insert one `JobCardCustomerVoice` row for every item in `customerVoices` with `createMany`. Each row stores the new job card database ID in `jobCardId`, maps the item's `labourId` to `actionToBeTaken`, and copies `customerVoiceDescription` and `observation`.

Both writes are in the same transaction, so the parent job card and its voice rows succeed or roll back together. On success, the API responds with HTTP 201 and the generated job card number.

## 5. Table-to-table data flow

| Step | Source or input | Destination table | Data written or relationship |
|---|---|---|---|
| Platform sign-in | Email/password and platform account | `platform_users` (read) | Email, active status, and password hash are checked. A token is issued with platform ID and role; no job card data is written. |
| Tenant provisioning | Platform token and tenant form | `Tenant` | Tenant details are inserted; `createdBy` references `PlatformUser.id`. |
| Tenant provisioning | New tenant ID and branch form | `Branch` | Branch details are inserted with `tenantId` referencing `Tenant.id`. |
| Tenant provisioning | New tenant ID | `Role` | Default tenant admin role is inserted with `tenantId`. |
| Tenant provisioning | New tenant ID | `EmployeeDesignation` | Tenant admin designation is inserted with `tenantId`. |
| Tenant provisioning | Tenant, branch, role, designation IDs and admin form | `Users` | Admin identity and password hash are stored; foreign keys connect the user to the tenant, branch, role, and designation. |
| Tenant login | Email/password and active tenant account | `Users` (read/update) | Credentials are checked and `lastLoginAt` is updated. The token carries tenant user ID and tenant ID for the job card request. |
| Labour setup | Tenant token and labour form | `LabourMaster` | Labour details are inserted with the authenticated `tenantId`; its generated `id` can be selected for a customer voice action. |
| Job card creation | Tenant token and job card form | `Tenant`, `Branch`, `Customer`, `Vehicle`, `Users`, service master tables (referenced) | `JobCard` will store foreign-key IDs for the tenant, selected branch/customer/vehicle/service category/service type/repair type, optional supervisor and technician, and creator. These related rows are not created by this endpoint. |
| Job card creation | Job card fields and generated number | `JobCard` | One parent row is inserted with `status = OPEN`, generated `jobCardNo`, job details, and related IDs. |
| Customer voice creation | Each `customerVoices` item and the new job card ID | `JobCardCustomerVoice` | One row per item: `jobCardId` references `JobCard.id`; `actionToBeTaken` references the item's `labourId` / `LabourMaster.id`; description and observation are copied from the item. |
| Job card detail/list read | Job card ID or tenant scope | `JobCard` and related tables | Handlers include customer, vehicle, service and repair types, branch, users, tenant, and customer voices with each voice's labour relation. |

The parent-child path is:

```text
Tenant user (Users.id, Users.tenantId)
                 │
                 ▼
       JobCard.createdBy / tenantId
                 │ JobCard.id
                 ▼
       JobCardCustomerVoice.jobCardId
                 │ actionToBeTaken
                 ▼
             LabourMaster.id
```

Other `JobCard` foreign keys connect it to `Tenant`, `Branch`, `Customer`, `Vehicle`, `Users` (supervisor/technician/creator), `ServiceCategoryMaster`, `ServiceTypeMaster`, and `RepairOrderTypeMaster`.

## 6. Reading the result and later lifecycle operations

The detail and list endpoints include customer voice rows and their related labour, alongside the job card's other relations. The create endpoint returns a success message with the generated number, not the complete inserted record.

The same controller also has update and close operations. Updating edits the parent job card and updates submitted customer voice rows by voice ID. Closing changes the job card status to `CLOSED`. These are later lifecycle actions, separate from creation.
