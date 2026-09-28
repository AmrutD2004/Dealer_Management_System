import { checkConnection } from "./checkConnection"

export const dbConnected = async()=>{
    const isConnected = await checkConnection()
    if(isConnected){
        console.log('✅ Database Connected Success')
    }
    else{
        console.log('❌ Database Connection failed')
    }
}