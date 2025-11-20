import express from 'express';

const app = express()
const PORT = 5000
let map = new Map()

app.use(express.json())
app.use((req, res, next) => {
    const ip = req.ip
    const now = Date.now()
    const windowMs = 60000 // 60sec

    let entry = map.get(ip) 

    if(!entry){
        entry = { count: 0, recordedTime: now }
        map.set(ip, entry)
    }

    if(now - entry.recordedTime < windowMs){
        entry.count++

        if(entry.count > 5){
            return res.json({ error: "Too many requests, try again later." })
        }
    }else{
        entry.count = 1
        entry.recordedTime = now
    }

    map.set(ip, entry)
    next()
})
app.get('/', (req, res) => {
    res.send("allowed")
})
app.get('/status', (req, res) => {
    const ip = req.ip
    const entry = map.get(ip) || { count : 0 }
    res.json({
        currentIpCount: entry.count
    })
})

app.listen(PORT, () => {
    console.log(`Server is listening on PORT: ${PORT}`)
})