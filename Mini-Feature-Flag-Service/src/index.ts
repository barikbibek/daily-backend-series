import express from 'express';
import { Flag, FlagManager } from './flagStore';

const app = express()
const PORT = 5000;
const flagMap = new FlagManager()

app.use(express.json())

app.post('/flags', (req, res) => {
    const { name, enabled } = req.body;
    if(typeof name !== 'string' || typeof enabled !== "boolean"){
        return res.status(400).json(({
            success: false,
            error: "Flag name and enabled status are required"
        }))
    }
    const flag: Flag = { name, enabled }
    flagMap.set(name, enabled)
    res.status(201).json({
        success: true,
        message: "Flag saved successfully",
        flag: {
            name: flag.name,
            enabled: flag.enabled
        }
    })
})
app.get('/flags/:name', (req, res) => {
    const { name } = req.params;
    const flag = flagMap.get(name)
    if(!flag) return res.status(404).json({ success: false, error: "Flag not found" })
    
    res.json({
        success: true,
        name: flag.name,
        enabled: flag.enabled
    })
})
app.delete('/flags/:name', (req, res) => {
    const { name } = req.params;
    if(!name) return res.status(400).json({ success: false, error: "Name is required." })
    if(!flagMap.has(name)){
        return res.status(404).json({ success: false, error: "Flag not found" })
    }
    flagMap.delete(name)
    res.json({
        success: true,
        message: "Flag deleted",
        name: name,
    })
})

app.listen(PORT, () => console.log(`Server is listening on PORT: ${PORT}`))