const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Load Data
const osiDataPath = path.join(__dirname, 'data', 'osi_tree.json');

app.get('/api/osi-model', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(osiDataPath, 'utf8'));
        
        // Dalo by se zde filtrovat podle 'level' parametru, např: /api/osi-model?level=3
        // Ale prozatím pošleme vše a frontend si to zafiltruje, což umožní rychlé přepínání na UI bez zbytečných requestů.
        
        res.json(data);
    } catch (error) {
        console.error("Chyba při čtení dat:", error);
        res.status(500).json({ error: "Interní chyba serveru při čtení datových souborů." });
    }
});

app.listen(PORT, () => {
    console.log(`Backend běží na http://localhost:${PORT}`);
});
