import express from "express";
import cors from "cors";
import data from "./store.js";

const app = express();
const port = 3000;

app.use(cors());

app.get("/", (req, res) => {
    let stanjeRacuna = data.stanje;
    res.json(stanjeRacuna);
});

app.get("/pregledPrihoda", (req, res) => {
    let prihodi = data.prihodi.data;
    res.json(prihodi);
});

app.listen(port, () => console.log(`Listening on port ${port}`));