import express from 'express'
import LRU from './cache'

const app = express()
const PORT = 5000
const cache = new LRU(3)

app.use(express.json())

app.post('/set', (req, res) => {
    const { key, value } = req.body;
    if(key === undefined || value === undefined) return res.json({ error: "Key not found"})
    cache.set(key, value)
    res.json({ message: "OK" })
})
app.get('/get/:key', (req, res) => {
    const { key } = req.params;
    if(!key) return res.json({ error: "Key not found"})
    const value = cache.get(key)
    if(value === null) return res.json({ error: "Key not found"})
    res.json({ value })
})

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`)
})