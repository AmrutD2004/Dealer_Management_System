export interface platformuserCreateType {
    email: string,
    passwordHash: string
}

export interface platformNewuserCreateType {
    email: string,
    passwordHash: string,
    role : string
}

export interface platformuserLoginType {
    email: string,
    passwordHash: string
}