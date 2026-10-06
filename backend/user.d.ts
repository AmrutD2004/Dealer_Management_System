declare namespace Express {
  export interface Request {
    user?: {  // ← add ?
      id: number
      email: string
      userType: 'PLATFORM_USER' | 'TENANT_USER'
      role?: string
      tenantId?: number
      branchId?: number
      roleId?: number
      roleCode?: string,
       puId: number,
      puRole: string
    }
  }
}