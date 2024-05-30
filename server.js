import express from 'express';
import dotenv from 'dotenv';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.static(__dirname + '/public'));
app.use(express.json());

app.use('/', async function(req, res) {
    res.sendFile('index.html', {
        root: 'public'
    });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Game running on ${PORT} Port!`);
});