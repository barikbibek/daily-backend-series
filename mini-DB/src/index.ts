import express from 'express'
import { deleteData, getData, helper, setData, setDataWithTime } from './helperFunc'
 

const app = express()
const PORT = 5000

app.use(express.json())

app.post('/set', (req, res) => {
    const { key, value } = req.body;
    if(key == null || value == null) return res.json({ error: "Key and value are required." })
    try {
        setData(key, value)
        res.json({ message: "Key stored successfully." })
    } catch (error) {
        res.json({ error: (error as Error).message })
    }
    
})
app.get('/get/:key', (req, res) => {
    const { key } = req.params;
    if(!key) return res.json({ error: "Key not found." })
    try {
        const data = getData(key)
        res.json({ key, value: data?.value })
    } catch (error) {
        res.json({ error: (error as Error).message })
    }
})
app.delete('/delete/:key', (req, res) => {
    const { key } = req.params;
    if(!key) return res.json({ error: "Key not found." })
    try {
        deleteData(key)
        res.json({ "message": "Key deleted successfully." })
    } catch (error) {
        res.json({ error: (error as Error).message })
    }
})
app.get('/list', (req, res) => {
    const data = helper()
    res.json({data})
})
app.get('/count', (req, res) => {
    const data = helper()
    const count = Object.keys(data).length
    res.json({ count })
})
app.post('/set-with-timestamp', (req, res) => {
    const { key, value } = req.body;
    if(key == null || value == null) return res.json({ error: "Key and value are required." })
    try {
        setDataWithTime(key, value)
        res.json({ message: "Key stored with timestamp." })
    } catch (error) {
        res.json({ error: (error as Error).message })
    }
})
app.get('/search/', (req, res) => {
    const { prefix } = req.query as {prefix: string}
    if (!prefix) return res.json({ error: "Prefix is required." })

    const data = helper()
    let result: Record<string, any> = {}
    for(const key of Object.keys(data)){
        if(key.startsWith(prefix)) result[key] = data[key]
    }

    if(Object.keys(result).length === 0) return res.json({ error: "No matching prefix" })
    
    res.json({ result })
})

app.listen(PORT, () => console.log(`Server is listening on PORT: ${PORT}`))