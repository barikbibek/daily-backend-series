import expres from 'express'
import jwt from 'jsonwebtoken'
import rateLimit from 'express-rate-limit'
import fs from 'fs'
import path from 'path'
import 'dotenv/config'
import authMiddleware from './authMiddleware'


const app = expres()
const PORT = process.env.PORT || 4000
const accessTokenSecret = process.env.ACCESSTOKEN || "xyzsecret" 
const refreshTokenSecret = process.env.REFRESHTOKEN || "refreshsecret" 
const filePath = path.join(__dirname, 'db.json')

const limiter = rateLimit({
    windowMs: 60 * 1000,   // 1 minute
    max: 5,                // max 5 login attempts per minute
    message: { error: "Too many login attempts. Try again later." }
})

interface User {
    password: string | number;
    refreshToken: string;        
}

interface UserType {
    [key: string]: User
}

const addUser = (username: string, password: string) => {
    let users: Record<string, User> = {}
    if(fs.existsSync(filePath)){
        const fileData = fs.readFileSync(filePath, 'utf-8')
        try {
            users = JSON.parse(fileData)
        } catch {
            users = {}
        }
    }
    if(users[username]) throw new Error(`User ${username} already exists.`)
    users[username] = { password, refreshToken: "" }

    fs.writeFileSync(filePath, JSON.stringify(users, null, 2), 'utf-8')
    console.log(`user: ${username} created successfully.`)
}

app.use(expres.json())

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if(!username || !password) return res.json({ error: "Invalid credential" })
    try {
        addUser(username, password)
    } catch (error) {
        return res.json({ error: (error as Error).message })
    }
    res.json({ message: "user created successfully" })
})
app.post('/login', limiter, async(req, res) => {
    const { username, password } = req.body;
    const fileData = fs.readFileSync(filePath, 'utf-8')
    const users = JSON.parse(fileData)
    if(!username || !password || !users[username] || users[username].password != password) return res.json({ error: "Invalid credential" })

    const accessToken = jwt.sign({username}, accessTokenSecret, { expiresIn: "10m" })
    const refreshToken = jwt.sign({username}, refreshTokenSecret, { expiresIn: "7d" })

    users[username].refreshToken = refreshToken
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2), 'utf-8')

    res.json({ token: accessToken })
})

app.post('/refresh', (req, res) => {
    const { refreshToken } = req.body;
    if(!refreshToken) return res.json({ error: "No refresh token" })
    
    const users = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    const user = Object.values(users).find((x: any) => x.refreshToken === refreshToken)
    if (!user) return res.json({ error: "Invalid refresh token" });

    try {
        const decoded = jwt.verify(refreshToken, refreshTokenSecret)
        if(typeof decoded !== 'string'){
            const newAccessToken = jwt.sign({ username: decoded.username }, accessTokenSecret, { expiresIn: '10m' })
            res.json({ token: newAccessToken })
        }
    } catch {
        res.json({ error: "Expired refresh token" })
    }
})

app.get('/profile', authMiddleware ,(req, res) => {
    if (!req.user) return res.json({ error: "Unauthorized" });
    const { username } = req.user as { username: string };
    res.json({ 
        "message": `Welcome ${username}`,
        "user": `${username}`
     })
})

app.post('/logout', (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.json({ error: "Expired refresh token" });

    const users = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

    const username = Object.keys(users).find((x) => users[x].refreshToken === refreshToken) as string
    if (!username) return res.json({ error: "Invalid refresh token" });
    users[username].refreshToken = ""
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2), 'utf-8')
    res.json({ message: "successfully logged out." })
})

app.listen(PORT, () => {
    console.log(`Server is listening on PORT: ${PORT}`)
})