export interface Role {
  id: number;
  roleCode: string;
  roleName: string;
}

export interface Branch {
  id: number;
  branchCode: string;
  branchName: string;
}

export interface Tenant {
  id: number;
  tenantCode: string;
  tenantName: string;
  subscriptionStatus: string;
}

export interface userInfoType {
    id: number;
  tenantId: number;
  branchId: number;
  employeeCode: string;
  roleId: number;
  designationId: number;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  mobileNo: string;
  isActive: boolean;
  lastLoginAt: string;
  createdAt: string;
  updatedAt: string;
  role: Role;
  branch: Branch;
  tenant: Tenant;


}