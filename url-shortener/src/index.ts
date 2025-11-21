import express from 'express';

const app = express()
const PORT = 5000;
let map = new Map()
let visited = new Map()

const generateCode = (len=6) => {
    let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let code = ""
    while(code.length < len){
        code += chars[Math.trunc(Math.random() * chars.length)]
    }
    if(map.has(code)){
        return generateCode()
    }
    return code
}


app.post('/shorten', express.json(), async (req, res) =>{
    const { url } = req.body;
    const host = req.get('host')
    if(!url) return res.json({ error: "Invalid Url"})
    const genCode = generateCode(5)
    map.set(genCode, url)
    visited.set(genCode, 0)
    const shortUrl = `http://${host}/${genCode}`
    res.json({
        shortUrl
    })
})
app.get('/:code', (req, res) =>{
    const { code } = req.params;
    if(!code) return res.json({ error: "Invalid short code" })
    const longUrl = map.get(code)
    if(!map.has(code)) return res.json({ error: "Invalid short code" })
    visited.set(code, (visited.get(code) || 0) + 1)
    res.redirect(longUrl)
})
app.get('/stats/:code', (req, res) =>{
    const { code } = req.params;
    if(!visited.has(code)){
        return res.json({ error: "Invalid code" })
    }
    res.json({ totalVisited: visited.get(code) })
})

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`)
})