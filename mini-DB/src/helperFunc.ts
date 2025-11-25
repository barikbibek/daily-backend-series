import { error } from 'console'
import fs from 'fs'
import path from 'path'

interface Data {
    [key: string] : {
        value: string,
        createdAt?: number,
        updatedAt?: number
    }
}

export const filePath = path.join(__dirname, "db.json")


export function helper(){
    let data: Data = {}
    if(fs.existsSync(filePath)){
        const fileData = fs.readFileSync(filePath, 'utf-8')
        try {
            data = JSON.parse(fileData)
        } catch {
            data = {}
        }
    }
    return data;
}

export function setData(key: string, value: string){
    let data = helper()
    
    if(data[key]){
        const existedData = data[key]
        data[key] = { ...existedData, value }
    }else{
        data[key] = { value }
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

export function setDataWithTime(key: string, value: string){
    let data = helper()
    
    const now = Date.now()

    if(data[key]){
        const existedData = data[key]
        data[key] = { ...existedData, value, updatedAt: now }
    }else{
        data[key] = { value, createdAt: now, updatedAt: now }
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

export function getData(key: string){
    let data = helper()

    if(!data[key]) throw new Error("key not found.")
    return data[key]
}

export function deleteData(key: string){
    let data = helper()

    if(!data[key]) throw new Error("key not found.")
    delete data[key]
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

