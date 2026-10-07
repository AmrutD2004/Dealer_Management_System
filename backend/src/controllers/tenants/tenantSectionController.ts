import { Request, Response } from "express"
import { prisma } from "../../prisma/lib/prisma";

export const createBranch = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    const { tenant_branchName,
        tenant_branchEmail,
        tenant_branchPhone,
        tenant_branchAddress,
        tenant_branchAddress2,
        tenant_branchLocality,
        tenant_branchCity,
        tenant_branchState,
        tenant_branchCountry,
        tenant_branchPincode } = req.body;
    if (!id || !tenantId) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    // if (roleCode !== 'ADMIN') {
    //     return res.status(401).json({
    //         success: false,
    //         message: 'Not authorized to perform operation'
    //     })
    // }
    try {
        const tenant = await prisma.tenant.findUnique({
            where: {
                id: Number(tenantId)
            }
        })
        const first2Character = tenant?.tenantName!
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((word: string) => word[0])
            .join('')
            .toUpperCase();
        const lastTenantBranch = await prisma.branch.findFirst({
            where: {
                tenantId: Number(tenantId)
            },
            orderBy: {
                id: 'desc'
            }
        })
        let branchNextNumber = 1
        if (lastTenantBranch) {
            const codePart = lastTenantBranch.branchCode.split("-")[1];

            if (codePart) {
                const numericPart = codePart.slice(-4);
                branchNextNumber = parseInt(numericPart, 10) + 1;
            }
        }
        const branch_code = `B-${first2Character}${String(branchNextNumber).padStart(4, "0")}`

        const data = await prisma.branch.create({
            data: {
                tenantId: tenantId,
                branchName: tenant_branchName,
                branchCode: branch_code,
                email: tenant_branchEmail,
                phone: tenant_branchPhone,
                pincode: tenant_branchPincode,
                address1: tenant_branchAddress,
                address2: tenant_branchAddress2 || null,
                locality: tenant_branchLocality,
                city: tenant_branchCity,
                state: tenant_branchState,
                country: tenant_branchCountry
            }
        })
        return res.status(201).json({
            success: true,
            message: `${data.branchName} is created of tenant ${tenant?.tenantName}`
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${err}`
        })
    }
}


export const updatedBranch = async(req : Request, res : Response)=>{
    const { id, tenantId } = req.user!
    const {branchId} = req.params;
    const { tenant_branchName,
        tenant_branchEmail,
        tenant_branchPhone,
        tenant_branchAddress,
        tenant_branchAddress2,
        tenant_branchLocality,
        tenant_branchCity,
        tenant_branchState,
        tenant_branchCountry,
        tenant_branchPincode } = req.body;
    if (!id || !tenantId) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    try {
        const tenant = await prisma.tenant.findUnique({
            where: {
                id: Number(tenantId)
            }
        })
        if(!tenant){
            return res.status(404).json({
                success : false,
                message : `Tenant with id ${tenantId} not exist`
            })
        }

        const data = await prisma.branch.update({
            data: {
                tenantId: tenantId,
                branchName: tenant_branchName,
                email: tenant_branchEmail,
                phone: tenant_branchPhone,
                pincode: tenant_branchPincode,
                address1: tenant_branchAddress,
                address2: tenant_branchAddress2 || null,
                locality: tenant_branchLocality,
                city: tenant_branchCity,
                state: tenant_branchState,
                country: tenant_branchCountry
            },
            where : {
                id : Number(branchId)
            }
        })
        return res.status(201).json({
            success: true,
            message: `${data.branchName} branch of tenant ${tenant?.tenantName} is updated`
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${err}`
        })
    }
}

export const deactivateTenantBranch = async(req : Request ,res : Response)=>{
    const { id, tenantId } = req.user!
    const {branchId} = req.params;
    
}