interface Store {
    value: any,
    tags: string[]
}

export class CacheWithTag {
    private store: Map<string, Store>;
    private tagIdx: Map<string, Set<string>>;

    constructor(){
        this.store = new Map();
        this.tagIdx = new Map();
    }

    set(key: string, value: any, tags: string[] = []) {
        this.store.set(key, { value, tags });

        for (const tag of tags) {
            if (!this.tagIdx.has(tag)) {
                this.tagIdx.set(tag, new Set());
            }
            this.tagIdx.get(tag)!.add(key);
        }
    }

    get(key: string) {
        const entry = this.store.get(key);
        return entry ? entry.value : null;
    }

    invalidateTag(tag: string): string[] | null {
        if (!this.tagIdx.has(tag)) return null;

        const keys = Array.from(this.tagIdx.get(tag)!);
        const deleted: string[] = [];

        for (const key of keys) {
            const entry = this.store.get(key);

            if (entry) {
                for (const t of entry.tags) {
                    this.tagIdx.get(t)?.delete(key);
                }
            }

            this.store.delete(key);
            deleted.push(key);
        }

        this.tagIdx.delete(tag);

        return deleted;
    }
}
