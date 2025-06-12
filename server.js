// server.js
import express from 'express';
import { handler } from './build/handler.js'; // généré par adapter-node

const app = express(); // ← ici on définit "app"

app.use(handler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Server running on http://0.0.0.0:${port}`);
});
