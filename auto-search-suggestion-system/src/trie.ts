export class Node {
    children: Map<string, Node>;
    isEnd: boolean;
    freq: number;

    constructor(){
        this.children = new Map();
        this.isEnd = false;
        this.freq = 0
    }
}

export class Trie {
    root: Node;

    constructor(){
        this.root = new Node()
    }
    
    insert(word: string): void{
        let node = this.root;

        for(const char of word){
            if(!node.children.has(char)){
                node.children.set(char, new Node())
            }
            node = node.children.get(char)!
        }
        node.isEnd = true
        node.freq++
    }

    search(word: string): string[]{
        let node = this.root;

        for(const char of word){
            if(!node.children.has(char)){
                return []
            }
            node = node.children.get(char)!
        }

        const result: string[] = []

        const dfs = (curr: Node, path: string) => {
            if(curr.isEnd) result.push(path)
            
            for(let [char, next] of curr.children){
                dfs(next, path + char)
            }
        }
        dfs(node, word)
        return result
    }

    getTopNSuggestion(preifx: string, n: number): Array<{ word: string, freq: number}>{
        let node = this.root;

        for(const char of preifx){
            if(!node.children.has(char)){
                return []
            }
            node = node.children.get(char)!
        }

        const result: Array<{ word: string, freq: number}> = []

        const dfs = (curr: Node, path: string) => {
            if(curr.isEnd) result.push({ word: path, freq: node.freq})
            
            for(let [char, next] of curr.children){
                dfs(next, path + char)
            }
        }
        dfs(node, preifx)
        result.sort((a, b) => {
            if(b.freq !== a.freq) return b.freq - a.freq;
            return a.word.localeCompare(b.word)
        })

        return result.slice(0, n)
    }
}