const express = require("express");
const fs = require("fs");
const https = require("https");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.get("/", (req, res) => res.send("Servidor funcionando"));

const PORT = process.env.PORT || 3000;
if (process.env.HTTPS === "true") {
  const options = {
    key: fs.readFileSync("/etc/letsencrypt/live/tu-dominio.com/privkey.pem"),
    cert: fs.readFileSync("/etc/letsencrypt/live/tu-dominio.com/fullchain.pem"),
  };
  https.createServer(options, app).listen(PORT, () => console.log(`Servidor HTTPS en puerto ${PORT}`));
} else {
  app.listen(PORT, () => console.log(`Servidor HTTP en puerto ${PORT}`));
}
