export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}


export default class TodoManager {
    private todos: Map<string, Todo>;

    constructor(){
        this.todos = new Map()
    }

    create(title: string): Todo {
        const id: string = Date.now().toString()

        const todo: Todo = {
            id,
            title,
            completed: false
        }
        this.todos.set(id, todo)
        return todo
    };
    getAll(): Todo[]{  
        return Array.from(this.todos.values())
    };
    get(id: string): Todo | null{
        return this.todos.get(id) ?? null
    };
    update(id: string, newTitle: string): Todo | null{
        const todo = this.todos.get(id) 
        if(!todo) return null
        const updated = {...todo, title: newTitle}
        this.todos.set(id, updated)
        return updated
    };
    toggle(id: string): Todo | null{
        const todo = this.todos.get(id)
        if(!todo) return null
        const { completed } = todo
        const updatedTodo = {...todo, completed: !completed}
        this.todos.set(id, updatedTodo)
        return updatedTodo
    };  // completed <-> not completed
    delete(id: string): boolean{
        return this.todos.delete(id)
    };
}
