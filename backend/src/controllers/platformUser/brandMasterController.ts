import { Request, Response } from "express";
import { prisma } from "../../prisma/lib/prisma";
import { UploadedFile } from "express-fileupload";
import * as XLSX from 'xlsx'

export const addBrand = async (req: Request, res: Response) => {
    const { id, userType } = req.user!;
    const { brandCode, brandName } = req.body;
    if (!id) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login'
        })
    }
    if (userType !== 'PLATFORM_USER') {
        return res.status(401).json({
            success: false,
            message: 'Platform User required'
        })
    }
    if (!brandCode || !brandName) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        })
    }
    try {
        const isBrandExits = await prisma.brandMaster.findUnique({
            where: { brandCode: brandCode },
            select: {
                brandName: true
            }
        })
        if (isBrandExits) {
            return res.status(500).json({
                success: false,
                message: `Brand already exists with name ${brandName}`
            })
        }
        const data = await prisma.brandMaster.create({
            data: {
                brandCode: brandCode,
                brandName: brandName
            }
        })
        return res.status(201).json({
            success: true,
            message: `Brand ${data.brandName} is Created`
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error ${error}`
        })
    }
}

export const updateBrand = async (req: Request, res: Response) => {
    const { id, userType } = req.user!;
    const { brandId } = req.params;
    const { brandCode, brandName } = req.body;
    if (!id) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login'
        })
    }
    if (userType !== 'PLATFORM_USER') {
        return res.status(401).json({
            success: false,
            message: 'Platform User required'
        })
    }
    if (!brandId) {
        return res.status(403).json({
            success: false,
            message: 'Brand id is required'
        })
    }
    if (!brandCode || !brandName) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        })
    }
    try {
        const isBrandExits = await prisma.brandMaster.findUnique({
            where: { brandCode: brandCode },
            select: {
                brandName: true
            }
        })
        if (!isBrandExits) {
            return res.status(500).json({
                success: false,
                message: `Brand not exists with name ${brandName}`
            })
        }
        const data = await prisma.brandMaster.update({
            data: {
                brandCode: brandCode,
                brandName: brandName
            },
            where: {
                id: Number(brandId)
            }
        })
        return res.status(201).json({
            success: true,
            message: `Brand ${data.brandName} is updated`
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error ${error}`
        })
    }
}

export const getBrandDetails = async (req: Request, res: Response) => {
    const { id, userType } = req.user!;
    const { brandId } = req.params;
    if (!id) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login'
        })
    }
    if (userType !== 'PLATFORM_USER') {
        return res.status(401).json({
            success: false,
            message: 'Platform User required'
        })
    }
    if (!brandId) {
        return res.status(403).json({
            success: false,
            message: 'Brand id is required'
        })
    }
    try {
        const isBrandExists = await prisma.brandMaster.findUnique({
            where: { id: Number(brandId) },
        })
        if (!isBrandExists) {
            return res.status(500).json({
                success: false,
                message: `Brand not exists`
            })
        }
        return res.status(201).json({
            success: true,
            data: isBrandExists
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error ${error}`
        })
    }
}

export const getListOfBrands = async (req: Request, res: Response) => {
    const { id, userType } = req.user!;
    const { skip, take } = req.query;
    if (!id) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login'
        })
    }
    try {
        const totalBrands = await prisma.brandMaster.count()
        let listOfBrands
        if (skip || take) {
            listOfBrands = await prisma.brandMaster.findMany({
                skip: Number(skip),
                take: Number(take)
            })
        }
        listOfBrands = await prisma.brandMaster.findMany()
        return res.status(201).json({
            success: true,
            data: listOfBrands,
            count: totalBrands
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error ${error}`
        })
    }
}


export const deactivateBrand = async (req: Request, res: Response) => {
    const { id, userType } = req.user!;
    const { brandId } = req.params;
    if (!id) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login'
        })
    }
    if (userType !== 'PLATFORM_USER') {
        return res.status(401).json({
            success: false,
            message: 'Platform User required'
        })
    }
    if (!brandId) {
        return res.status(403).json({
            success: false,
            message: 'Brand id is required'
        })
    }
    try {
        const isBrandExits = await prisma.brandMaster.findUnique({
            where: { id: Number(brandId) },
            select: {
                brandName: true
            }
        })
        if (!isBrandExits) {
            return res.status(500).json({
                success: false,
                message: `Brand not exists`
            })
        }
        const data = await prisma.brandMaster.update({
            data: {
                isActive: false
            },
            where: {
                id: Number(brandId)
            }
        })
        return res.status(201).json({
            success: true,
            message: `Brand ${data.brandName} is deactivated`
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error ${error}`
        })
    }
}

export const activateBrand = async (req: Request, res: Response) => {
    const { id, userType } = req.user!;
    const { brandId } = req.params;
    if (!id) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login'
        })
    }
    if (userType !== 'PLATFORM_USER') {
        return res.status(401).json({
            success: false,
            message: 'Platform User required'
        })
    }
    if (!brandId) {
        return res.status(403).json({
            success: false,
            message: 'Brand id is required'
        })
    }
    try {
        const isBrandExits = await prisma.brandMaster.findUnique({
            where: { id: Number(brandId) },
            select: {
                brandName: true
            }
        })
        if (!isBrandExits) {
            return res.status(500).json({
                success: false,
                message: `Brand not exists`
            })
        }
        const data = await prisma.brandMaster.update({
            data: {
                isActive: true
            },
            where: {
                id: Number(brandId)
            }
        })
        return res.status(201).json({
            success: true,
            message: `Brand ${data.brandName} is activated`
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error ${error}`
        })
    }
}



export const addBrandsModelsVarinatsWithExcels = async (
    req: Request,
    res: Response
) => {
    const { id, userType } = req.user!;

    const file = req.files?.file as UploadedFile | undefined;

    if (!id) {
        return res.status(401).json({
            success: false,
            message: "Not authorized login"
        });
    }

    if (userType !== "PLATFORM_USER") {
        return res.status(401).json({
            success: false,
            message: "Platform User required"
        });
    }

    if (!file) {
        return res.status(400).json({
            success: false,
            message: "Excel file is required"
        });
    }

    try {
        const workbook = XLSX.read(file.data, { type: "buffer" });

        const sheetName = workbook.SheetNames[0];

        if (!sheetName) {
            return res.status(400).json({
                success: false,
                message: "Excel sheet not found"
            });
        }

        const sheet = workbook.Sheets[sheetName];

        const sheetData = XLSX.utils.sheet_to_json<any>(sheet);

        if (!sheetData.length) {
            return res.status(400).json({
                success: false,
                message: "Excel sheet is empty"
            });
        }

        const result = await prisma.$transaction(async (tx: any) => {

            // STEP 1: Extract unique brands
            const uniqueBrands = Array.from(
                new Map(
                    sheetData.map((row: any) => {
                        const brandName = String(row.Brand_Names).trim();

                        return [
                            brandName.toLowerCase(),
                            {
                                brandName,
                                brandCode: String(row.Brand_Codes).trim()
                            }
                        ];
                    })
                ).values()
            );

            // STEP 2: Insert brands
            const brandResult = await tx.brandMaster.createMany({
                data: uniqueBrands,
                skipDuplicates: true
            });

            // STEP 3: Fetch brand IDs
            const brandNames = uniqueBrands.map(
                (brand: any) => brand.brandName
            );

            const brandIds = await tx.brandMaster.findMany({
                where: {
                    brandName: {
                        in: brandNames,
                        mode: "insensitive"
                    }
                },
                select: {
                    id: true,
                    brandName: true
                }
            });

            // STEP 4: Create brand Map
            const brandMap = new Map(
                brandIds.map((brand: any) => [
                    brand.brandName.trim().toLowerCase(),
                    brand.id
                ])
            );

            // STEP 5: Prepare unique models
            const uniqueModelMap = new Map();

            for (const row of sheetData) {
                const brandName = String(row.Brand_Names)
                    .trim()
                    .toLowerCase();

                const brandId = brandMap.get(brandName);

                if (!brandId) {
                    throw new Error(`Brand not found: ${row.Brand_Names}`);
                }

                const modelName = String(row.Model_Names).trim();
                const modelCode = String(row.Model_Codes).trim();
                const bodyType = String(row.Body_Type).trim();

                if (!modelName || !modelCode) {
                    throw new Error(`Model name or code missing for brand: ${brandName}`);
                }

                const key = `${brandId}_${modelCode.toLowerCase()}`;

                uniqueModelMap.set(key, {
                    modelName,
                    modelCode,
                    brandId,
                    bodyType
                });
            }

            // STEP 6: Insert unique models
            const uniqueModels = Array.from(uniqueModelMap.values());

            const modelResult = await tx.vehicleModelMaster.createMany({
                data: uniqueModels,
                skipDuplicates: true
            });

            // STEP 7: Fetch model IDs
            const brandIdList = [
                ...new Set(uniqueModels.map((model: any) => model.brandId))
            ];

            const modelCodeList = [
                ...new Set(uniqueModels.map((model: any) => model.modelCode))
            ];

            const modelIds = await tx.vehicleModelMaster.findMany({
                where: {
                    brandId: {
                        in: brandIdList
                    },
                    modelCode: {
                        in: modelCodeList
                    }
                },
                select: {
                    id: true,
                    brandId: true,
                    modelCode: true
                }
            });

            // STEP 8: Create model Map
            const modelMap = new Map(
                modelIds.map((model: any) => [
                    `${model.brandId}_${model.modelCode.toLowerCase()}`,
                    model.id
                ])
            );

            // STEP 9: Prepare unique variants
            const uniqueVariantMap = new Map();

            for (const row of sheetData) {
                const brandName = String(row.Brand_Names)
                    .trim()
                    .toLowerCase();

                const brandId = brandMap.get(brandName);

                const modelCode = String(row.Model_Codes).trim();

                const modelId = modelMap.get(
                    `${brandId}_${modelCode.toLowerCase()}`
                );

                if (!modelId) {
                    throw new Error(
                        `Model not found: ${row.Model_Names} (${modelCode})`
                    );
                }

                const variantName = String(row.Variant_Names).trim();
                const variantCode = String(row.Variant_Codes).trim();
                const fuelType = String(row.Fuel_Type).trim();
                const isActive = Boolean(row.Is_Active);
                const productionFrom = new Date(row.Production_From);
                const productionTo = row.Production_To ? new Date(row.Production_To) : null;
                const transmissionType = String(row.Transmission_Type);
                

                if (!variantName || !variantCode) {
                    throw new Error(
                        `Variant name or code missing for model: ${modelCode}`
                    );
                }

                const key = `${modelId}_${variantCode.toLowerCase()}`;

                uniqueVariantMap.set(key, {
                    variantName,
                    variantCode,
                    modelId,
                    fuelType,
                    transmissionType,
                    isActive,
                    productionFrom,
                    productionTo
                });
            }

            // STEP 10: Insert unique variants
            const uniqueVariants = Array.from(
                uniqueVariantMap.values()
            );

            const variantResult = await tx.vehicleVariantMaster.createMany({
                data: uniqueVariants,
                skipDuplicates: true
            });

            return {
                brandsInserted: brandResult.count,
                modelsInserted: modelResult.count,
                variantsInserted: variantResult.count
            };
        });

        return res.status(200).json({
            success: true,
            message: "Brands, models and variants imported successfully",
            result
        });

    } catch (error) {
        console.error("Excel import error:", error);

        return res.status(500).json({
            success: false,
            message: `Server error: ${
                error instanceof Error ? error.message : "Unknown error"
            }`
        });
    }
};
