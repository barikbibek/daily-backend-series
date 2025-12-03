import express from 'express';
import { Flag, FlagManager } from './flagStore';
import { loadFlags, saveFlags } from './storage';

const app = express();
const PORT = 5000;
const flagMap = new FlagManager();

app.use(express.json());

async function initFlags() {
    const flags = await loadFlags();
    for (const flag of flags) {
        flagMap.set(flag.name, flag.enabled);
    }
}
initFlags();

app.post('/flags', async (req, res) => {
    const { name, enabled } = req.body;

    if (typeof name !== 'string' || typeof enabled !== 'boolean') {
        return res.status(400).json({
            success: false,
            error: "Flag name and enabled status are required"
        });
    }

    const flag = flagMap.set(name, enabled);

    await saveFlags(flagMap.getAll());

    res.status(201).json({
        success: true,
        message: "Flag saved successfully",
        flag
    });
});

app.get('/flags/:name', (req, res) => {
    const flag = flagMap.get(req.params.name);

    if (!flag) {
        return res.status(404).json({ success: false, error: "Flag not found" });
    }

    res.json({
        success: true,
        flag
    });
});

app.delete('/flags/:name', async (req, res) => {
    const name = req.params.name;

    if (!flagMap.has(name)) {
        return res.status(404).json({ success: false, error: "Flag not found" });
    }

    flagMap.delete(name);
    await saveFlags(flagMap.getAll());

    res.json({
        success: true,
        message: "Flag deleted",
        name
    });
});

app.get('/flags', (req, res) => {
    res.json({
        success: true,
        flags: flagMap.getAll()
    });
});

app.listen(PORT, () =>
    console.log(`Server is listening on PORT: ${PORT}`)
);
