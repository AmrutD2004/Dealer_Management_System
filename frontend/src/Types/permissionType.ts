export interface PermissionListType {
    id: number,
    permissionCode: string,
    permissionName: string,
    description: string | null,
    isActive: boolean,
    createdAt: string,
    updatedAt: string
}

/* Mirrors the backend payload for POST create and PUT update. The backend
   expects the description under `permissionDescription`. */

export interface PermissionCreateType {
    permissionCode: string,
    permissionName: string,
    permissionDescription: string
}

export interface PermissionConfirmActionType {
    type: 'deactivate' | 'activate',
    permissionId: number,
    permissionName: string
}
