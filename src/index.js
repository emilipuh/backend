import express from "express";
import cors from "cors";
import podaci from "./store.js";
import connect from "./db.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  // let data = podaci.stanje;
  // res.json(data);
  let db = await connect() // promise
  let cursor = await db.collection("prihodi").find();
  let data = await cursor.toArray()
  res.json(data)
});

app.get("/memory", (req, res) => {
  // pregled svega iz lokalne memorije
  let stanjeRacuna = podaci.stanje;
  res.json(stanjeRacuna);
});

app.get("/pregledPrihoda_memory", (req, res) => {
  // prihodi iz lokalne hardcoded memorije
  let prihodi = podaci.prihodi;
  res.json(prihodi);
});

app.post("/dodajPrihod_memory", (req, res) => {
  // dodavanje prihoda u lokalnu memoriju
  // dodajemo novi prihod
  let prihod = req.body;
  console.log(req.body);
  podaci.prihodi.push(prihod); // jako neuredno
  res.json("OK");
});

app.listen(port, () => console.log(`Listening on port ${port}`));
