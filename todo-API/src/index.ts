import express from 'express'
import TodoManager from './todos'

const app = express()
const PORT = 5000
const todos = new TodoManager()

app.use(express.json())

app.post('/todos', (req, res) => {
    const { title } = req.body
    if(!title) return res.status(400).json({ error: "Title is required" })
    const todo = todos.create(title)
    res.json({ message : "Todo created", todo })
})
app.get('/todos', (req, res) => {
    const allTodos = todos.getAll()
    res.json({todo: allTodos})
})
app.get('/todos/:id', (req, res) => {
    const { id } = req.params;
    if(!id) return res.status(400).json({ error: "id is required" })
    const todo = todos.get(id)
    if(todo === null) return res.status(404).json({ error: "Todo not found" })
    res.json({ todo })
})
app.put('/todos/:id', (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    if(!title) return res.status(400).json({ error: "Title is required" })
    const todo = todos.update(id, title)
    if(todo === null) return res.status(404).json({ error: "Todo not found" })
    res.json({ message: "Todo updated", todo })
})
app.patch('/todos/:id/toggle', (req, res) => {
    const { id } = req.params;
    if(!id) return res.status(400).json({ error: "id is required" })
    const todo = todos.toggle(id)
    if(todo === null) return res.status(404).json({ error: "Todo not found" })
    res.status(200).json({ message: "Todo toggled", todo })
})
app.delete('/todos/:id', (req, res) => {
    const { id } = req.params;
    if(!id) return res.status(400).json({ error: "id is required" })
    const deleted = todos.delete(id)
    if(!deleted) return res.status(404).json({ error: "Todo not found" })
    
    res.status(200).json({ message: "Todo deleted" })
})

app.listen(PORT, () => console.log(`Server is listening on PORT: ${PORT}`))