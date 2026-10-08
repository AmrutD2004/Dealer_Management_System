import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthContext";
import type { branchListType } from "@/Types/tenantCreateType";
import { getTenantBranchList } from "@/api/endpoints";
import { toast } from "@/components/ui/toast";

export const TenantContext = createContext<any | null>(null)


export const TenantContextProvider = ({children} : {children : React.ReactNode})=>{
    const { isLoggedIn } = useContext(AuthContext)
    const [branchList, setBranchList] = useState<branchListType[]>([])
    const [skip, setSkip] = useState<number>(0)
    const [take, setTake] = useState<number>(3)
    const [totalBranches, setTotalBranches] = useState<number>(0)

        const fetchTenantBranchList = async (skip: number, take: number) => {
        try {
            const data = await getTenantBranchList(skip, take)
            if (data?.success) {
                setBranchList(data?.data)
                setTotalBranches(data?.count)
            }
        } catch (err: any) {
            toast.add({
                type: 'error',
                description: err?.response?.data?.message
            })
        }
    }
    useEffect(() => {
        fetchTenantBranchList(skip, take)
    }, [isLoggedIn, skip, take])
    return (
        <TenantContext.Provider value={{
            branchList, skip, take, setSkip, totalBranches, fetchTenantBranchList
        }}>
            {children}
        </TenantContext.Provider>
    )
}