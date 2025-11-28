import axios from "axios";
import * as cheerio from "cheerio";
import { Router, Request, Response } from "express";

const router = Router()

router.get('/health', (req: Request, res: Response) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() })
})

router.post('/api/metadata', async (req: Request, res: Response) => {
    const { url } = req.body;
    if(!url || typeof url !== "string") return res.status(400).json({ error: "Invalid or missing URL." })

    try {
        const { data } = await axios.get<string>(url)
        const $ = cheerio.load(data)

        const title = $("title").text().trim()
        const description = $('meta[name="description"]').attr("content")?.trim() || ""

        res.json({ title, description })
    } catch (error) {
        res.status(500).json({ error: "Internal server error." })
    }
})

export default router;