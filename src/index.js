import express from "express";
import cors from "cors";
import podaci from "./store.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    let stanjeRacuna = podaci.stanje;
    res.json(stanjeRacuna);
});

app.get("/pregledPrihoda", (req, res) => {
    let prihodi = podaci.prihodi;
    res.json(prihodi);
});

app.post("/dodajPrihod", (req, res) => {
    // dodajemo novi prihod
    let prihod = req.body;
    console.log(req.body)
    podaci.prihodi.push(prihod); // jako neuredno
    res.json("OK");
});

app.listen(port, () => console.log(`Listening on port ${port}`));