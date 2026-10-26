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

## 7. Tenant user manages dealer bays

The tenant router exposes dealer bay operations under `/api/tenant/bay`. Every route applies `authenticate` and `requireTenantUser`. A `DealerBayMaster` row belongs to a tenant and a branch and stores its bay code, name, optional description, and active state. The schema makes `(branchId, bayCode)` unique.

| Operation | Endpoint | Behavior |
|---|---|---|
| Create | `POST /api/tenant/bay/create` | Requires bay code, name, and branch ID. Checks for an existing code in that branch, then creates the bay with the authenticated tenant ID. |
| Update | `PUT /api/tenant/bay/:bayId/update` | Requires bay ID, code, name, and branch ID; updates the bay using both bay ID and authenticated tenant ID. |
| List | `GET /api/tenant/bay/get/all` | Returns bays and count for the authenticated tenant, including branch and tenant relations. Supports optional `skip` and `take`. |
| Details | `GET /api/tenant/bay/get/:bayId` | Fetches a bay by ID with branch and tenant relations. |
| Deactivate / activate | `PATCH /api/tenant/bay/:bayId/deactivate` / `PATCH /api/tenant/bay/:bayId/activate` | Sets the selected row's `isActive` value to `false` or `true`. |

Bay creation associates the supplied branch ID with the authenticated tenant ID; the handler does not independently verify that the branch belongs to that tenant. The detail and activation handlers look up rows by bay ID without a tenant filter, while the update write and list query are tenant-scoped.

## 8. Tenant user allocates a job card to a bay and mechanic

Allocation routes are under `/api/tenant/jobcard/allocate` and require tenant authentication. The `JobCardAllocation` row links a job card, a mechanic (`Users`), and a dealer bay, with a required bay-in time and optional bay-out time. Creating an allocation requires all four input fields: `jobCardId`, `bayId`, `mechanicId`, and `bayInDateTime`.

Before creating an allocation, the controller rejects a job card that already has an allocation with `bayOutTime = null`, rejects a bay that is already occupied by such an allocation, and checks that the selected user's role code is `MECHANIC`. It then creates the allocation and returns a message naming the job card, mechanic, and bay. Updating requires the same fields and checks that the selected user has the mechanic role; it writes the new job card, bay, mechanic, and bay-in time for the allocation ID.

| Operation | Endpoint | Behavior |
|---|---|---|
| Allocate | `POST /api/tenant/jobcard/allocate` | Creates a bay/job card/mechanic allocation after the active-allocation and mechanic-role checks. |
| Update | `PUT /api/tenant/jobcard/allocate/:allocatedId/update` | Updates the linked job card, bay, mechanic, and bay-in time for the allocation ID. |
| List | `GET /api/tenant/jobcard/allocate/get/all` | Returns allocations whose job card belongs to the authenticated tenant, with job card, bay, and mechanic relations; includes a count and supports optional `skip` and `take`. |
| Details | `GET /api/tenant/jobcard/allocate/get/:allocatedId` | Fetches one allocation by ID with its job card, bay, and mechanic relations. |

The list query is tenant-scoped through `JobCard.tenantId`. The create, update, and detail lookups do not add tenant filters to the referenced IDs or allocation ID. There is no allocation close-out endpoint in these routes; the active occupancy checks use a null `bayOutTime`, and this controller does not set that field.

The relationship path is:

```text
Tenant (via JobCard.tenantId)
          │
          ▼
       JobCard ─────── JobCardAllocation ─────── DealerBayMaster
                              │
                              └───────────────── Users (mechanic)
```

## 9. Tenant user manages HSN codes

The tenant router exposes HSN master operations under `/api/tenant/hsn` (the server mounts the tenant router under `/api`). Every route applies `authenticate` and `requireTenantUser`, so the controller receives the tenant user's ID and tenant ID from the authenticated request. The HSN master stores a code, optional description, optional tax rate, active state, and its owning tenant in `HSNMaster`; `(tenantId, hsnCode)` is unique.

| Operation | Endpoint | Behavior |
|---|---|---|
| Create | `POST /api/tenant/hsn/create` | Requires `hsnCode`, checks for a duplicate within the authenticated tenant, and creates the row with that tenant ID. `taxRate` is parsed as a number and `description` is optional. |
| Update | `PUT /api/tenant/hsn/:hsnId/update` | Requires the HSN ID and code, then updates the code, tax rate, and description. The update query includes both the HSN ID and authenticated tenant ID. |
| List | `GET /api/tenant/hsn/get/all` | Returns HSN rows and the total count for the authenticated tenant. Optional `skip` and `take` query parameters are passed to Prisma for pagination. |
| Details | `GET /api/tenant/hsn/get/:hsnId` | Fetches one HSN row by ID and includes its tenant relation. |
| Deactivate / activate | `PATCH /api/tenant/hsn/:hsnId/deactivate` / `PATCH /api/tenant/hsn/:hsnId/activate` | Sets `isActive` to `false` or `true` for the row identified by HSN ID. |

HSN creation does not create or modify a tenant; `tenantId` comes from the tenant user's authentication claims. List and create duplicate checks are tenant-scoped. In the current controller, the detail lookup and the activate/deactivate lookups use the HSN ID without adding a tenant filter, while update's write is tenant-filtered.

The HSN data path is:

```text
Tenant user (Users.id, Users.tenantId)
                 │
                 ▼
       HSNMaster.tenantId
                 │
                 └── HSNMaster.hsnCode (unique within the tenant)
```
