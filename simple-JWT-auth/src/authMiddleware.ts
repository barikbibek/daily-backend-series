import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import 'dotenv/config'

export default async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization']
    const token = authHeader?.split(' ')[1] 
    if(!token) return res.json({ error: "Unauthorized" })
    try {
        const decoded = jwt.verify(token, process.env.ACCESSTOKEN!)
        req.user = decoded
        next()
    } catch (error) {
        return res.json({ error: "Unauthorized" })
    }
}