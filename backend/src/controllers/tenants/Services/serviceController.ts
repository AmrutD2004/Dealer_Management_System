import { Request, Response } from "express";
import { prisma } from "../../../prisma/lib/prisma";
import { count } from "console";


//Service Category
export const createServiceCategory = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    const {
        code,
        name,
        description
    } = req.body;
    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: "Not Authorized login again",
        });
    }
    if (
        !code ||
        !name
    ) {
        return res.status(404).json({
            success: false,
            message: "All field required",
        });
    }
    try {
        const checkCodeExists = await prisma.serviceCategoryMaster.findUnique({
            where : {code : code , tenantId : Number(tenantId)}
        })
        if (checkCodeExists){
            return res.status(403).json({
                success : false,
                message : `Category already exists with code ${code}`
            })
        }
        const data = await prisma.serviceCategoryMaster.create({
            data : {
                code : code,
                name : name,
                description : description || null,
                tenantId  : Number(tenantId),
                isActive : true
            }
        })
        return res.status(201).json({
            success : true,
            message : `${data.name} service category added`
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${error}`
        })
    }
}


export const updateServiceCategory = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    const {serviceCategoryId} = req.params;
    if(!serviceCategoryId){
        return res.status(404).json({
            success : false,
            message : 'service category required'
        })
    }
    const {
        code,
        name,
        description
    } = req.body;
    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: "Not Authorized login again",
        });
    }
    if (
        !code ||
        !name
    ) {
        return res.status(404).json({
            success: false,
            message: "All field required",
        });
    }
    try {
        const checkCodeExists = await prisma.serviceCategoryMaster.findUnique({
            where : {id : Number(serviceCategoryId) , tenantId : Number(tenantId)}
        })
        if (!checkCodeExists){
            return res.status(403).json({
                success : false,
                message : `Category not exists with code ${code}`
            })
        }
        const data = await prisma.serviceCategoryMaster.update({
            data : {
                code : code,
                name : name,
                description : description || null,
            },
            where : {
                id : Number(serviceCategoryId),
                tenantId : Number(tenantId)
            }
        })
        return res.status(201).json({
            success : true,
            message : `${data.name} service category updated`
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${error}`
        })
    }
}


export const getListOfServiceCategory = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: "Not Authorized login again",
        });
    }
    try {
         const serviceCategoryCount = await prisma.serviceCategoryMaster.count({
            where : {
                tenantId : Number(tenantId)
            }
        })
        const serviceCategoryList = await prisma.serviceCategoryMaster.findMany({
            where : {
                tenantId : Number(tenantId)
            },
            include :{
                tenant : {
                    select : {
                        tenantName : true
                    }
                }
            }
        })
        return res.status(201).json({
            success : true,
            data : serviceCategoryList,
            count : serviceCategoryCount
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${error}`
        })
    }
}


export const getServiceCategoryDetails = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    const {serviceCategoryId} = req.params;
    if(!serviceCategoryId){
        return res.status(404).json({
            success : false,
            message : 'service category required'
        })
    }
    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: "Not Authorized login again",
        });
    }
    try {
        const checkCodeExists = await prisma.serviceCategoryMaster.findUnique({
            where : {id : Number(serviceCategoryId) , tenantId : Number(tenantId)},
            include : {
                tenant : {
                    select : {
                        tenantName : true
                    }
                }
            }
        })
        if (!checkCodeExists){
            return res.status(403).json({
                success : false,
                message : `Category not exists with code`
            })
        }
        return res.status(201).json({
            success : true,
            data : checkCodeExists
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${error}`
        })
    }
}

export const deactivateServiceCategory = async (req: Request, res: Response) => {
  const { id, tenantId } = req.user!;
  const { serviceCategoryId } = req.params;
  if (!id || !tenantId) {
    return res.status(404).json({
      success: false,
      message: "Not Authorized login again",
    });
  }
  if (!serviceCategoryId) {
    return res.status(404).json({
      success: false,
      message: "service category id required",
    });
  }
  try {
    const data = await prisma.serviceCategoryMaster.update({
      where: { id: Number(serviceCategoryId), tenantId: Number(tenantId) },
      data: {
        isActive: false,
      },
    });
    return res.status(200).json({
      success: true,
      message: `${data.name} service category is deactivated`,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message  : `server error : ${err}`
    });
  }
};

export const activateServiceCategory = async (req: Request, res: Response) => {
  const { id, tenantId } = req.user!;
  const { serviceCategoryId } = req.params;
  if (!id || !tenantId) {
    return res.status(404).json({
      success: false,
      message: "Not Authorized login again",
    });
  }
  if (!serviceCategoryId) {
    return res.status(404).json({
      success: false,
      message: "service category id required",
    });
  }
  try {
    const data = await prisma.serviceCategoryMaster.update({
      where: { id: Number(serviceCategoryId), tenantId: Number(tenantId) },
      data: {
        isActive: true,
      },
    });
    return res.status(200).json({
      success: true,
      message: `${data.name} service category is activated`,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message : `Server error : ${err}`
    });
  }
};



//Service Type
export const createServiceType = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    const {
        code,
        name,
        description,
        serviceCategoryId
    } = req.body;
    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: "Not Authorized login again",
        });
    }
    if (
        !code ||
        !name || !serviceCategoryId
    ) {
        return res.status(404).json({
            success: false,
            message: "All field required",
        });
    }
    try {
        const checkServiceTypeExists = await prisma.serviceTypeMaster.findFirst({
            where : {code : code , tenantId : Number(tenantId)}
        })
        if (checkServiceTypeExists){
            return res.status(403).json({
                success : false,
                message : `Service type already exists with code ${code}`
            })
        }
        const data = await prisma.serviceTypeMaster.create({
            data : {
                code : code,
                name : name,
                description : description || null,
                tenantId  : Number(tenantId),
                serviceCategoryMasterId : Number(serviceCategoryId),
                isActive : true
            },
            include : {
                serviceCategoryMaster : {
                    select : {
                        name : true
                    }
                }
            }
        })
        return res.status(201).json({
            success : true,
            message : `${data.name} service type is added in ${data.serviceCategoryMaster.name} category`
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${error}`
        })
    }
}


export const updateServiceType = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    const {serviceTypeId} = req.params;
    if(!serviceTypeId){
        return res.status(404).json({
            success : false,
            message : 'service type id required'
        })
    }
    const {
        code,
        name,
        description,
        serviceCategoryId
    } = req.body;
    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: "Not Authorized login again",
        });
    }
    if (
        !code ||
        !name || !serviceCategoryId
    ) {
        return res.status(404).json({
            success: false,
            message: "All field required",
        });
    }
    try {
        const checkServiceTypeExists = await prisma.serviceTypeMaster.findUnique({
            where : {id : Number(serviceTypeId) , tenantId : Number(tenantId)}
        })
        if (!checkServiceTypeExists){
            return res.status(403).json({
                success : false,
                message : `service type not exists with code ${code}`
            })
        }
        const data = await prisma.serviceTypeMaster.update({
            data : {
                code : code,
                name : name,
                description : description || null,
                serviceCategoryMasterId : Number(serviceCategoryId)
            },
            where : {
                id : Number(serviceTypeId),
                tenantId : Number(tenantId)
            }
        })
        return res.status(201).json({
            success : true,
            message : `${data.name} service type updated`
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${error}`
        })
    }
}


export const getListOfServiceType = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    const {skip, take} = req.query
    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: "Not Authorized login again",
        });
    }
    try {
         const serviceTypeCount = await prisma.serviceTypeMaster.count({
            where : {
                tenantId : Number(tenantId)
            }
        })
        let serviceTypeList
        if(skip || take){
             serviceTypeList = await prisma.serviceTypeMaster.findMany({
            skip : Number(skip),
            take : Number(take),
            where : {
                tenantId : Number(tenantId)
            },
            include : {
                serviceCategoryMaster : true,
                tenant : {
                    select : {
                        tenantName : true
                    }
                }
            }
        })
        }else{
            serviceTypeList = await prisma.serviceTypeMaster.findMany({
            where : {
                tenantId : Number(tenantId)
            }
        })
        }
        return res.status(201).json({
            success : true,
            data : serviceTypeList,
            count : serviceTypeCount
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${error}`
        })
    }
}


export const getServiceTypeDetails = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    const {serviceTypeId} = req.params;
    if(!serviceTypeId){
        return res.status(404).json({
            success : false,
            message : 'service type id required'
        })
    }
    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: "Not Authorized login again",
        });
    }
    try {
        const checkServiceTypeExists = await prisma.serviceTypeMaster.findUnique({
            where : {id : Number(serviceTypeId) , tenantId : Number(tenantId)},
            include : {
                serviceCategoryMaster : {
                    select : {
                        name : true
                    }
                },
                tenant : {
                    select : {
                        tenantName : true
                    }
                }
            }
        })
        if (!checkServiceTypeExists){
            return res.status(403).json({
                success : false,
                message : `Service type not exists with code`
            })
        }
        return res.status(201).json({
            success : true,
            data : checkServiceTypeExists
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${error}`
        })
    }
}

export const deactivateServiceType = async (req: Request, res: Response) => {
  const { id, tenantId } = req.user!;
  const { serviceTypeId } = req.params;
  if (!id || !tenantId) {
    return res.status(404).json({
      success: false,
      message: "Not Authorized login again",
    });
  }
  if (!serviceTypeId) {
    return res.status(404).json({
      success: false,
      message: "service type id required",
    });
  }
  try {
    const checkServiceTypeExists = await prisma.serviceTypeMaster.findUnique({
            where : {id : Number(serviceTypeId) , tenantId : Number(tenantId)},
            include : {
                serviceCategoryMaster : {
                    select : {
                        name : true
                    }
                },
                tenant : {
                    select : {
                        tenantName : true
                    }
                }
            }
        })
        if (!checkServiceTypeExists){
            return res.status(403).json({
                success : false,
                message : `Service type not exists with code`
            })
        }
    const data = await prisma.serviceTypeMaster.update({
      where: { id: Number(serviceTypeId), tenantId: Number(tenantId) },
      data: {
        isActive: false,
      },
    });
    return res.status(200).json({
      success: true,
      message: `${data.name} service type is deactivated`,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message  : `server error : ${err}`
    });
  }
};

export const activateServiceType = async (req: Request, res: Response) => {
  const { id, tenantId } = req.user!;
  const { serviceTypeId } = req.params;
  if (!id || !tenantId) {
    return res.status(404).json({
      success: false,
      message: "Not Authorized login again",
    });
  }
  if (!serviceTypeId) {
    return res.status(404).json({
      success: false,
      message: "service type id required",
    });
  }
  try {
    const checkServiceTypeExists = await prisma.serviceTypeMaster.findUnique({
            where : {id : Number(serviceTypeId) , tenantId : Number(tenantId)},
            include : {
                serviceCategoryMaster : {
                    select : {
                        name : true
                    }
                },
                tenant : {
                    select : {
                        tenantName : true
                    }
                }
            }
        })
        if (!checkServiceTypeExists){
            return res.status(403).json({
                success : false,
                message : `Service type not exists with code`
            })
        }
    const data = await prisma.serviceTypeMaster.update({
      where: { id: Number(serviceTypeId), tenantId: Number(tenantId) },
      data: {
        isActive: true,
      },
    });
    return res.status(200).json({
      success: true,
      message: `${data.name} service type is activated`,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message : `Server error : ${err}`
    });
  }
};

