export interface tenantCreateType {
    tenantName: string,
    email: string,
    phone: string,
    gstNumber: string,
    address: string,
    city: string,
    state: string,
    country: string,
    pincode: string,
    subscriptionPlan: string,
    subscriptionStatus: string
}

export interface branchCreateType {
    branchName: string,
    email: string,
    phone: string,
    address1: string,
    address2: string | null,
    locality: string,
    city: string,
    state: string,
    country: string,
    pincode: string,
}

export interface userCreateType {
    firstName: string,
    middleName: string,
    lastName: string,
    email: string,
    mobileNo: string,
    passwordHash: string
}