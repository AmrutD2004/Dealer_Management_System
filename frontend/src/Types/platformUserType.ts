
export interface LoginType {
    email: string,
    passwordHash: string
}
export interface PlatformUsersListType {
    id : number,
    email : string,
    passwordHash : string,
    role : string,
    isActive : boolean,
    createdAt : string,
    updatedAt : string
}

export interface PlatformNewuserCreateType {
    email: string,
    passwordHash: string,
    role: string,
  };

export interface PlatformUserEditType {
    id : number
    email: string,
    passwordHash: string,
    role: string,
  };
