import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../../prisma/lib/prisma";

export const createEmployee = async (req: Request, res: Response) => {
  const { id, tenantId } = req.user!;
  const {
    email,
    firstName,
    lastName,
    middleName,
    mobileNo,
    passwordHash,
    designationId,
    roleId,
    branchId,
  } = req.body;
  if (!id || !tenantId) {
    return res.status(404).json({
      success: false,
      message: "Not Authorized login again",
    });
  }
  if (
    !email ||
    !firstName ||
    !lastName ||
    !middleName ||
    !mobileNo ||
    !passwordHash ||
    !designationId ||
    !roleId ||
    !branchId
  ) {
    return res.status(404).json({
      success: false,
      message: "All field required",
    });
  }
  try {
    const isUserExists = await prisma.users.findFirst({
      where: {
        email: email,
        tenantId: tenantId,
      },
      include: {
        tenant: {
          select: {
            tenantName: true,
          },
        },
        branch: {
          select: {
            branchName: true,
          },
        },
      },
    });
    if (isUserExists) {
      return res.status(302).json({
        success: false,
        message: `Employess already exists in branch ${isUserExists.branch.branchName} of tenant ${isUserExists.tenant.tenantName}`,
      });
    }
    const hashPassword = await bcrypt.hash(passwordHash, 10);
    const lastUser = await prisma.users.findFirst({
      where: {
        tenantId: Number(tenantId),
      },
      orderBy: {
        id: "desc",
      },
    });

    let employeeNextNumber = 1;

    if (lastUser) {
      const codePart = lastUser.employeeCode.split("-")[1];

      if (codePart) {
        const numericPart = codePart.slice(-4);
        employeeNextNumber = parseInt(numericPart, 10) + 1;
      }
    }

    const employeeCode = `EMP-${String(employeeNextNumber).padStart(4, "0")}`;
    const data = await prisma.users.create({
      data: {
        email: email,
        passwordHash: hashPassword,
        designationId: Number(designationId),
        roleId: Number(roleId),
        branchId: Number(branchId),
        tenantId: Number(tenantId),
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        mobileNo: mobileNo,
        isActive: true,
        employeeCode: employeeCode,
      },
      include: {
        tenant: {
          select: {
            tenantName: true,
          },
        },
        branch: {
          select: {
            branchName: true,
          },
        },
      },
    });
    return res.status(201).json({
      success: true,
      message: `Employee ${data.firstName} ${data.lastName} is added in branch ${data.branch.branchName} of tenant ${data.tenant.tenantName}`,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
    });
  }
};

export const updateEmployeeDetails = async (req: Request, res: Response) => {
  const { id, tenantId } = req.user!;
  const { employeeId } = req.params;
  const {
    email,
    firstName,
    lastName,
    middleName,
    mobileNo,
    passwordHash,
    designationId,
    roleId,
    branchId,
  } = req.body;
  if (!id || !tenantId) {
    return res.status(404).json({
      success: false,
      message: "Not Authorized login again",
    });
  }
  if (
    !email ||
    !firstName ||
    !lastName ||
    !middleName ||
    !mobileNo ||
    !designationId ||
    !roleId ||
    !branchId
  ) {
    return res.status(404).json({
      success: false,
      message: "All field required",
    });
  }
  if (!employeeId) {
    return res.status(404).json({
      success: false,
      message: "employee id required",
    });
  }
  try {
    const isUserExists = await prisma.users.findUnique({
      where: {
        id: Number(employeeId),
        tenantId: Number(tenantId),
      },
      include: {
        tenant: {
          select: {
            tenantName: true,
          },
        },
        branch: {
          select: {
            branchName: true,
          },
        },
      },
    });
    if (!isUserExists) {
      return res.status(302).json({
        success: false,
        message: `Employess not exists`,
      });
    }

    const data = await prisma.users.update({
      where: {
        id: Number(employeeId),
      },
      data: {
        email: email,
        ...(passwordHash
          ? { passwordHash: await bcrypt.hash(passwordHash, 10) }
          : {}),
        designationId: Number(designationId),
        roleId: Number(roleId),
        branchId: Number(branchId),
        tenantId: Number(tenantId),
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        mobileNo: mobileNo,
      },
      include: {
        tenant: {
          select: {
            tenantName: true,
          },
        },
        branch: {
          select: {
            branchName: true,
          },
        },
        role: {
          select: {
            roleName: true,
          },
        },
        designation: {
          select: {
            name: true,
          },
        },
      },
    });
    return res.status(201).json({
      success: true,
      message: `Employee ${data.firstName} ${data.lastName} is updated in branch ${data.branch.branchName} of tenant ${data.tenant.tenantName}`,
      data,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
    });
  }
};

export const getListOfTenantEmployee = async (req: Request, res: Response) => {
  const { id, tenantId } = req.user!;
  const { skip, take } = req.query;
  if (!id || !tenantId) {
    return res.status(404).json({
      success: false,
      message: "Not Authorized login again",
    });
  }
  try {
    const totalEmployee = await prisma.users.count({
      where: {
        tenantId: Number(tenantId),
      },
    });
    let employeeList;
    if (skip || take) {
      employeeList = await prisma.users.findMany({
        skip: Number(skip),
        take: Number(take),
        where: { tenantId: Number(tenantId) },
        include: {
          tenant: {
            select: {
              tenantName: true,
            },
          },
          role: {
            select: {
              roleName: true,
            },
          },
          designation: {
            select: {
              name: true,
            },
          },
          branch: {
            select: {
              branchName: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      employeeList = await prisma.users.findMany({
        where: { tenantId: Number(tenantId) },
        include: {
          tenant: {
            select: {
              tenantName: true,
            },
          },
          role: {
            select: {
              roleName: true,
            },
          },
          designation: {
            select: {
              name: true,
            },
          },
          branch: {
            select: {
              branchName: true,
            },
          },
        },
      });
    }
    return res.status(200).json({
      success: true,
      data: employeeList,
      count: totalEmployee,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
    });
  }
};

export const getTenantEmployeeDetails = async (req: Request, res: Response) => {
  const { id, tenantId } = req.user!;
  const { employeeId } = req.params;
  if (!id || !tenantId) {
    return res.status(404).json({
      success: false,
      message: "Not Authorized login again",
    });
  }
  if (!employeeId) {
    return res.status(404).json({
      success: false,
      message: "employee id required",
    });
  }
  try {
    const employeeDetails = await prisma.users.findUnique({
      where: { id: Number(employeeId), tenantId: Number(tenantId) },
      include: {
        tenant: {
          select: {
            tenantName: true,
          },
        },
        role: {
          select: {
            roleName: true,
          },
        },
        designation: {
          select: {
            name: true,
          },
        },
        branch: {
          select: {
            branchName: true,
          },
        },
      },
    });
    return res.status(200).json({
      success: true,
      data: employeeDetails,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
    });
  }
};

export const deactivateEmployee = async (req: Request, res: Response) => {
  const { id, tenantId } = req.user!;
  const { employeeId } = req.params;
  if (!id || !tenantId) {
    return res.status(404).json({
      success: false,
      message: "Not Authorized login again",
    });
  }
  if (!employeeId) {
    return res.status(404).json({
      success: false,
      message: "employee id required",
    });
  }
  try {
    const data = await prisma.users.update({
      where: { id: Number(employeeId), tenantId: Number(tenantId) },
      data: {
        isActive: false,
      },
    });
    return res.status(200).json({
      success: true,
      message: `${data.firstName} ${data.lastName} is deactivated`,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
    });
  }
};

export const activateEmployee = async (req: Request, res: Response) => {
  const { id, tenantId } = req.user!;
  const { employeeId } = req.params;
  if (!id || !tenantId) {
    return res.status(404).json({
      success: false,
      message: "Not Authorized login again",
    });
  }
  if (!employeeId) {
    return res.status(404).json({
      success: false,
      message: "employee id required",
    });
  }
  try {
    const data = await prisma.users.update({
      where: { id: Number(employeeId), tenantId: Number(tenantId) },
      data: {
        isActive: true,
      },
    });
    return res.status(200).json({
      success: true,
      message: `${data.firstName} ${data.lastName} is activated`,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
    });
  }
};
