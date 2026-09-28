import { prisma } from "../prisma/lib/prisma"

export const checkConnection = async()=>{
    try{
        await prisma.$queryRaw `SELECT 1`
        return true
    }catch(err){
        return false
    }
}