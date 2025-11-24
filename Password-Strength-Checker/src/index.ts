import express from 'express'
import rateLimit from 'express-rate-limit'
import checkPasswordStrength from './checkStrength'

const app = express()
const PORT = 5000
const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    message: "Too many requests from this IP, please try again after a minute"
})

app.use(express.json())

app.get('/', (req, res) => {
    res.send("hello")
})

app.post('/check-password',limiter, (req, res) => {
    const { password } = req.body;
    if(!password) return res.json({ error : "Invalid Password"})
    const result = checkPasswordStrength(password)
    res.json({
        score: result.score,
        strength: result.strength,
        issues: result.issues
    })
})

app.listen(PORT, () => console.log(`Server is listening on PORT: ${PORT}`))