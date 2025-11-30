export interface Flag {
    name: string,
    enabled: boolean
}
export class FlagManager {
    private flagMap: Map<string, Flag>;

    constructor(){
        this.flagMap = new Map()
    }

    set(name: string, enabled: boolean){
        const flag: Flag = { name, enabled }
        this.flagMap.set(name, flag)
        return flag
    }

    get(name: string): Flag | undefined {
        return this.flagMap.get(name)
    }
    has(name: string): boolean {
        return this.flagMap.has(name)
    }

    delete(name: string): boolean{
        return this.flagMap.delete(name)
    }
}