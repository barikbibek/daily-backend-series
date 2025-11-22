export default class LRU {
    private capacity: number;
    private cache;
    constructor(capacity: number){
        this.capacity = capacity
        this.cache = new Map()
    }

    set(key: string, value: string){
        if(this.cache.has(key)){
            this.cache.delete(key)
        }else if(this.cache.size >= this.capacity){
            const oldestKey = this.cache.keys().next().value;
            this.cache.delete(oldestKey)
        }
        this.cache.set(key, value)
    }

    get(key: string){
        if(!this.cache.has(key)) return null
        const value = this.cache.get(key)
        this.cache.delete(key)
        this.cache.set(key, value)
        return value;
    }
}