import express from 'express';
import { CacheWithTag } from './cache';

const app = express()
const PORT = 5000;
const cache = new CacheWithTag()

app.use(express.json())

app.post('/set', (req, res) => {
    const { key, value, tags } = req.body;

    if (!key)
        return res.status(400).json({ success: false, error: "Key is required" });

    if (value === undefined)
        return res.status(400).json({ success: false, error: "Value is required" });

    if (tags && !Array.isArray(tags))
        return res.status(400).json({ success: false, error: "Tags must be an array" });

    cache.set(key, value, tags || []);

    res.json({
        success: true,
        message: "Value cached successfully",
        stored: { key, tags: tags || [] }
    });
})
app.get('/get/:key', (req, res) => {
    const { key } = req.params;
    if(!key) return res.status(400).json({ success: false, error: "Key is required"})
    const data = cache.get(key)
    if(data === null) return res.status(404).json({ success: false, error: "Key not found in cache" })
    
    res.json({ success: true, key, value: data })
})
app.post('/invalidate-tag', (req, res) => {
    const { tag } = req.body;
    if (!tag)
        return res.status(400).json({ success: false, error: "Tag is required" });

    const deletedKeys = cache.invalidateTag(tag);

    if (deletedKeys === null)
        return res.status(404).json({ success: false, error: "Tag not found" });

    res.json({
        success: true,
        message: "Tag invalidated successfully",
        tag,
        deletedKeys
    });
})


app.listen(PORT, () => console.log(`Server is listenning on PORT: ${PORT}`))
