import { APP_MODE } from "../../types/app.types.js"


export function isDev(): boolean{
    const mode: string | undefined = process.env.NODE_ENV
    if(!mode) throw new Error("mode not defined")
    if(mode === APP_MODE.development){
        return true
    }
    return false    
}