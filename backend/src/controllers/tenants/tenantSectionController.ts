import { Request, Response } from "express"
import { prisma } from "../../prisma/lib/prisma";
import { UploadedFile } from "express-fileupload";
import * as XLSX from 'xlsx'

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


export const updatedBranch = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    const { branchId } = req.params;
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
        if (!tenant) {
            return res.status(404).json({
                success: false,
                message: `Tenant with id ${tenantId} not exist`
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
            where: {
                id: Number(branchId)
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

export const deactivateTenantBranch = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    const { branchId } = req.params;
    if (!branchId) {
        return res.status(404).json({
            success: false,
            message: 'branch id required'
        })
    }
    if (!id || !tenantId) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    try {
        const isBranchExits = await prisma.branch.findUnique({
            where: {
                id: Number(branchId),
            },
            include: {
                tenant: true
            }
        })
        if (!isBranchExits) {
            return res.status(404).json({
                success: false,
                message: 'Branch not exits'
            })
        }
        const data = await prisma.branch.update({
            data: {
                isActive: false
            },
            where: { id: Number(branchId) }
        })
        return res.status(200).json({
            success: true,
            message: `${data.branchName} of tenant ${isBranchExits.tenant.tenantName} deactivated`
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${error}`
        })
    }

}

export const activateTenantBranch = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    const { branchId } = req.params;
    if (!branchId) {
        return res.status(404).json({
            success: false,
            message: 'branch id required'
        })
    }
    if (!id || !tenantId) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    try {
        const isBranchExits = await prisma.branch.findUnique({
            where: {
                id: Number(branchId),
                tenantId: Number(tenantId)
            },
            include: {
                tenant: true
            }
        })
        if (!isBranchExits) {
            return res.status(404).json({
                success: false,
                message: 'Branch not exits'
            })
        }
        const data = await prisma.branch.update({
            data: {
                isActive: true
            },
            where: {
                id: Number(branchId),
                tenantId: Number(tenantId)
            }
        })
        return res.status(200).json({
            success: true,
            message: `${data.branchName} of tenant ${isBranchExits.tenant.tenantName} activated`
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${error}`
        })
    }

}

export const getTenantBranchList = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!;
    const { skip, take } = req.query
    if (!id || !tenantId) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    try {
        const totalBranches = await prisma.branch.count({
            where: {
                tenantId: Number(tenantId)
            }
        })
        const branchList = await prisma.branch.findMany({
            skip: Number(skip),
            take: Number(take),
            where: {
                tenantId: Number(tenantId)
            },
            orderBy: {
                createdAt: 'desc',
            }
        })
        return res.status(200).json({
            success: true,
            data: branchList,
            count: totalBranches
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${err}`
        })
    }
}

export const getTenantBranchById = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!;
    const { branchId } = req.params;
    if (!branchId) {
        return res.status(404).json({
            success: false,
            message: 'branch id required'
        })
    }
    if (!id || !tenantId) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login again'
        })
    }

    try {
        const isBranchExits = await prisma.branch.findUnique({
            where: {
                id: Number(branchId),
                tenantId: Number(tenantId)
            },
            include: {
                tenant: true
            }
        })
        if (!isBranchExits) {
            return res.status(404).json({
                success: false,
                message: 'Branch not exits'
            })
        }
        const branchDetails = await prisma.branch.findUnique({
            where: {
                id: Number(branchId),
                tenantId: Number(tenantId)
            }
        })
        return res.status(200).json({
            success: true,
            data: branchDetails
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${error}`
        })
    }
}


export const createBranchWithExcel = async(req : Request , res : Response)=>{
    const { id, tenantId } = req.user!
    const branchesExcelData = req.files?.file as UploadedFile | null;
    if (!id || !tenantId) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    if(!branchesExcelData){
        return res.status(400).json({
            success : true,
            message : 'Excel file not found'
        })
    }
    try{
        const readedFile = XLSX.read(branchesExcelData.data, {type : 'buffer'})
        const sheetName = readedFile.SheetNames[0]
        const sheet = readedFile.Sheets[sheetName]
        const sheetData = XLSX.utils.sheet_to_json(sheet)
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
        const branchesName = sheetData.map((b : any) => b['Branch_Name'].trim())

        const isBranchExits = await prisma.branch.findMany({
            where : {
                tenantId : Number(tenantId),
                branchName : {
                    in : branchesName
                }
            }
        })
        const existsingBranchesNames = isBranchExits.map((b : any)=> b.branchName)
        if(isBranchExits.length > 0){
            return res.status(403).json({
                success : true,
                message : 'Some Branch is already exists in excel',
                existingBranch : existsingBranchesNames
            })
        }

        const data = await prisma.branch.createMany({
            data : sheetData.map((branch : any, index : any)=>({
                tenantId: Number(tenantId),
                branchName: branch.Branch_Name,
                branchCode: `B-${first2Character}${String(branchNextNumber + index).padStart(4, "0")}`,
                email: branch.Branch_Email,
                phone: branch.Branch_Phone,
                pincode: branch.Branch_Pincode,
                address1: branch.Branch_Address,
                address2: branch.Branch_Address2 || null,
                locality: branch.Branch_Locality,
                city: branch.Branch_City,
                state: branch.Branch_State,
                country: branch.Branch_Country
            }))
        })
        return res.status(201).json({
            success : true,
            message : 'Branch Data inserted'
        })
    }catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${error}`
        })
    }
}