import { Request, Response } from "express"
import { prisma } from "../../prisma/lib/prisma";
import bcrypt from 'bcrypt'

export const createTenant = async (req: Request, res: Response) => {
    const { puId, puRole } = req.user;
    if(puRole !== 'SUPER_ADMIN'){
        return res.status(401).json({
            success : false,
            message : 'Not authoried to perform operation'
        })
    }
    const {
        //Tenant Details
        tenant_name, tenant_email, tenant_phone, tenant_gst_number, tenant_address, tenant_register_city, tenant_register_state, tenant_register_country, tenant_register_pincode, tenant_sub_plan, tenant_sub_status,

        // Initial Branch Details
        tenant_initial_branchName, tenant_initial_branchEmail, tenant_initial_branchPhone, tenant_initial_branchAddress, tenant_initial_branchAddress2, tenant_initial_branchLocality, tenant_initial_branchCity, tenant_initial_branchState, tenant_initial_branchCountry, tenant_initial_branchPincode,
        // Initial Tenant Admin Details
        first_name, middle_name, last_name, email, phone_no, passwordHash
    } = req.body
    const requiredFields = {
        tenant_name,
        tenant_email,
        tenant_phone,
        tenant_gst_number,
        tenant_address,
        tenant_register_city,
        tenant_register_state,
        tenant_register_country,
        tenant_register_pincode,
        tenant_sub_plan,
        tenant_sub_status,

        // Initial Branch Details
        tenant_initial_branchName,
        tenant_initial_branchEmail,
        tenant_initial_branchPhone,
        tenant_initial_branchAddress,
        tenant_initial_branchLocality,
        tenant_initial_branchCity,
        tenant_initial_branchState,
        tenant_initial_branchCountry,
        tenant_initial_branchPincode,

        // Initial Tenant Admin Details
        first_name,
        middle_name,
        last_name,
        email,
        phone_no,
        passwordHash,
    };

    const missingFields = Object.entries(requiredFields)
        .filter(([, value]) => !value)
        .map(([key]) => key);

    if (missingFields.length > 0) {
        return res.status(400).json({
            success: false,
            message: `Missing required fields: ${missingFields.join(", ")}`,
            missingFields,
        });
    }
    const isTenantExists = await prisma.tenant.findFirst({
        where: { email: tenant_email }
    })
    if (isTenantExists) {
        return res.status(409).json({
            success: false,
            message: 'Tenant already exists with these email'
        })
    }
    const isUserExists = await prisma.users.findFirst({
        where: {
            email: email
        }
    });

    if (isUserExists) {
        return res.status(409).json({
            success: false,
            message: "User already exists with this email"
        });
    }
    try {
        const lastTenant = await prisma.tenant.findFirst({
            orderBy: {
                id: 'desc'
            }
        })
        let tenantNextNumber = 1000

        if (lastTenant) {
            const codePart = lastTenant.tenantCode.split("-")[1];

            if (codePart) {
                tenantNextNumber = parseInt(codePart, 10) + 1;
            }
        }
        const first2Character = tenant_name
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((word: string) => word[0])
            .join('')
            .toUpperCase();
        const tenant_code = `T-${first2Character}${String(tenantNextNumber).padStart(4, "0")}`

        const lastBranch = await prisma.branch.findFirst({
            orderBy: {
                id: 'desc'
            }
        })
        let branchNextNumber = 1
        if (lastBranch) {
            const codePart = lastBranch.branchCode.split("-")[1];

            if (codePart) {
                branchNextNumber = parseInt(codePart, 10) + 1;
            }
        }
        const branch_code = `B-${first2Character}${String(branchNextNumber).padStart(4, "0")}`



        const result = await prisma.$transaction(async (tx) => {

            // --------------------------------
            // 1. CREATE TENANT
            // --------------------------------
            const tenant = await tx.tenant.create({
                data: {
                    tenantCode: tenant_code,
                    tenantName: tenant_name,
                    email: tenant_email,
                    phone: tenant_phone,
                    gstNumber: tenant_gst_number,
                    address: tenant_address,
                    city: tenant_register_city,
                    state: tenant_register_state,
                    country: tenant_register_country,
                    pincode: tenant_register_pincode,
                    subscriptionPlan: tenant_sub_plan,
                    subscriptionStatus: tenant_sub_status,
                    isActive: true,
                    createdBy: puId
                }
            });


            // --------------------------------
            // 2. CREATE INITIAL BRANCH
            // --------------------------------
            const branch = await tx.branch.create({
                data: {
                    tenantId: tenant.id,
                    branchCode: branch_code,
                    branchName: tenant_initial_branchName,
                    email: tenant_initial_branchEmail,
                    phone: tenant_initial_branchPhone,
                    address1: tenant_initial_branchAddress,
                    address2: tenant_initial_branchAddress2 || null,
                    locality: tenant_initial_branchLocality,
                    city: tenant_initial_branchCity,
                    state: tenant_initial_branchState,
                    country: tenant_initial_branchCountry,
                    pincode: tenant_initial_branchPincode,
                    isActive: true
                }
            });


            // --------------------------------
            // 3. CREATE DEFAULT ADMIN ROLE
            // --------------------------------
            const adminRole = await tx.role.create({
                data: {
                    tenantId: tenant.id,
                    roleCode: "ADMIN",
                    roleName: "Admin",
                    roleDescription: "Tenant administrator",
                    isSystemRole: true,
                    isActive: true
                }
            });


            // --------------------------------
            // 4. CREATE TENANT ADMIN DESIGNATION
            // --------------------------------
            const tenantAdminDesignation =
                await tx.employeeDesignation.create({
                    data: {
                        tenantId: tenant.id,
                        code: "TENANT_ADMIN",
                        name: "Tenant Admin",
                        description: "Tenant administrator",
                        isActive: true,
                        isMechanic: false
                    }
                });


            // --------------------------------
            // 5. CREATE FIRST TENANT ADMIN USER
            // --------------------------------
            const lastUser = await tx.users.findFirst({
                where: {
                    tenantId: tenant.id
                },
                orderBy: {
                    id: "desc"
                }
            });

            let employeeNextNumber = 1;

            if (lastUser) {
                const codePart = lastUser.employeeCode.split("-")[1];

                if (codePart) {
                    employeeNextNumber = parseInt(codePart, 10) + 1;
                }
            }

            const employeeCode = `EMP-${String(employeeNextNumber).padStart(4, "0")}`;
            const hashedPassword = await bcrypt.hash(passwordHash, 10)
            const user = await tx.users.create({
                data: {
                    tenantId: tenant.id,
                    branchId: branch.id,
                    employeeCode: employeeCode,

                    roleId: adminRole.id,
                    designationId: tenantAdminDesignation.id,

                    firstName: first_name,
                    middleName: middle_name || null,
                    lastName: last_name,
                    email: email,
                    mobileNo: phone_no,
                    passwordHash: hashedPassword,

                    isActive: true
                }
            });


            return {
                tenant,
                branch,
                adminRole,
                tenantAdminDesignation,
                user
            };
        });
        return res.status(201).json({
            success: true,
            message: "Tenant created successfully",
            data: {
                tenantId: result.tenant.id,
                tenantCode: result.tenant.tenantCode,

                branchId: result.branch.id,
                branchCode: result.branch.branchCode,
                adminUserId: result.user.id,

                roleId: result.adminRole.id,

                designationId: result.tenantAdminDesignation.id
            }
        });
    } catch (error) {
        return res.status(500).json({
            success : false,
            message : `Server error ${error}`
        })
    }
}