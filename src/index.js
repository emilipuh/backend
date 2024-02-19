import express from "express";
import cors from "cors";
import connect from "./db.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// vraća mi prihode sa backenda u jsonu
app.get("/", async (req, res) => {
  let db = await connect(); 
  let cursor = await db.collection("stanjeRacuna").find();
  let data = await cursor.toArray();
  res.json(data);
});

app.get("/pregledPrihoda", async (req, res) => {
  let db = await connect();
  let cursor = await db.collection("prihodi").find();
  let data = await cursor.toArray();
  res.json(data);
});

app.post("/noviPrihod", async (req, res) => {
  let data = req.body;

  if (!data.iznos || !data.kategorija || !data.datum) {
    res.json({
      status: "fail",
      reason: "prihod nije kompletan",
    });

    return; // da se ne ubacuju podaci u bazu, tj. da program ne ide dalje
  }

  let db = await connect();
  let rezultat = await db.collection("prihodi").insertOne(data);

  
  if (rezultat && rezultat.acknowledged === true) {
    res.json(data);
    console.log(data);
  } else {
    res.json({
      status: "fail",
    });
  }
});

app.listen(port, () => console.log(`Listening on port ${port}`));
