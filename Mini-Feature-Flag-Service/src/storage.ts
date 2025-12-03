import { promises as fs} from 'fs'
import path from 'path'
import { Flag } from './flagStore'

const filePath = path.join(__dirname, "flag.json")

export async function loadFlags(): Promise<Flag[]>{
    try {
        const fileData = await fs.readFile(filePath, "utf8")
        let data: unknown = JSON.parse(fileData)

        if(Array.isArray(data)){
            return data as Flag[]
        }else{
            return []
        }
    } catch (error) {
        console.log("Error: ", (error as Error).message)
        return []
    }
}

export async function saveFlags(flags: Flag[]): Promise<void>{
    try {
        const data = JSON.stringify(flags, null, 2)
        await fs.writeFile(filePath, data, "utf-8")
    } catch (error) {
        console.log("Error: ", (error as Error).message)
        throw new Error("Error saving flags")
    }
}