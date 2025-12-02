import express from 'express'
import { Trie } from './trie'
import cors from 'cors'

const app = express()
const PORT = 5000
const storage = new Trie()
app.use(cors())
app.use(express.json())

app.post('/api/word', (req, res) => {
    const { word } = req.body;
    if(!word) return res.status(400).json({ error: "word is required" })
    storage.insert(word)
    res.status(201).json({ message: "insertion successful." })
})

app.get('/api/suggest', (req, res) => {
    const { prefix, limit } = req.query;    
    if(!prefix && !limit) return res.status(400).json({ error: "all fields are required" })
    const result = storage.getTopNSuggestion((prefix as string), Number(limit))
    res.status(200).json(result)
})

app.listen(PORT, () => console.log(`Server is listening on PORT: ${PORT}`))