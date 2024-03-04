import express from "express";
import cors from "cors";
import connect from "./db";
import auth from "./auth";
import { BSON, ObjectId } from "mongodb";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// registracija
app.post("/korisnici", async (req, res) => {
  let korisnik = req.body;
  try {
    let id = await auth.registerUser(korisnik);
    res.json({ id: id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// autentifikacija
app.post("/auth", async (req, res) => {
  let korisnik = req.body;
  try {
    let result = await auth.authenticateUser(
      korisnik.username,
      korisnik.password
    );
    res.json(result);
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
});

// provjera da li je potpis valjan
app.get("/tajna", [auth.verify], async (req, res) => {
  res.json({ message: "Ovo je tajna " + req.jwt.username })  
})

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

app.get("/pregledRashoda", async (req, res) => {
  let db = await connect();
  let cursor = await db.collection("rashodi").find();
  let data = await cursor.toArray();
  res.json(data);
});

app.get("/pregledStednji", async (req, res) => {
  let db = await connect();
  let cursor = await db.collection("stednja").find();
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

app.post("/noviRashod", async (req, res) => {
  let data = req.body;

  if (!data.iznos || !data.kategorija || !data.datum) {
    res.json({
      status: "fail",
      reason: "rashod nije kompletan",
    });

    return;
  }

  let db = await connect();
  let rezultat = await db.collection("rashodi").insertOne(data);

  if (rezultat && rezultat.acknowledged === true) {
    res.json(data);
    console.log(data);
  } else {
    res.json({
      status: "fail",
    });
  }
});

app.post("/novaStednja", async (req, res) => {
  let data = req.body;

  if (!data.iznos || !data.datum) {
    res.json({
      status: "fail",
      reason: "stednja nije kompletna",
    });

    return;
  }

  let db = await connect();
  let rezultat = await db.collection("stednja").insertOne(data);

  if (rezultat && rezultat.acknowledged === true) {
    res.json(data);
    console.log(data);
  } else {
    res.json({
      status: "fail",
    });
  }
});

app.get("/detaljiPrihoda/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let db = await connect();

    let prihod = await db
      .collection("prihodi")
      .findOne({ _id: new BSON.ObjectId(id) });
    if (!prihod) {
      return res.status(404).json({ message: "Prihod nije pronađen." });
    }
    res.json(prihod);
  } catch (error) {
    console.error("Greška prilikom dohvaćanja detalja prihoda:", error);
    res
      .status(500)
      .json({ message: "Greška prilikom dohvaćanja detalja prihoda." });
  }
});

app.get("/detaljiRashoda/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let db = await connect();

    let rashod = await db
      .collection("rashodi")
      .findOne({ _id: new BSON.ObjectId(id) });
    if (!rashod) {
      return res.status(404).json({ message: "Rashod nije pronađen." });
    }
    res.json(rashod);
  } catch (error) {
    console.error("Greška prilikom dohvaćanja detalja rashoda:", error);
    res
      .status(500)
      .json({ message: "Greška prilikom dohvaćanja detalja rashoda." });
  }
});

app.get("/detaljiStednje/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let db = await connect();

    let stednja = await db
      .collection("stednja")
      .findOne({ _id: new BSON.ObjectId(id) });

    if (!stednja) {
      return res.status(404).json({ message: "Štednja nije pronađena." });
    }
    res.json(stednja);
  } catch (error) {
    console.error("Greška prilikom dohvaćanja detalja štednje:", error);
    res
      .status(500)
      .json({ message: "Greška prilikom dohvaćanja detalja štednje." });
  }
});

app.delete("/detaljiPrihoda/:id", async (req, res) => {
  try {
    let id = req.params.id; // Dohvaćanje ID-a prihoda iz URL parametara
    console.log(id);
    let db = await connect();

    let rezultat = await db
      .collection("prihodi")
      .deleteOne({ _id: new BSON.ObjectId(id) }); // Brisanje prihoda iz baze podataka
    if (rezultat.deletedCount === 1) {
      res.json({ success: true, message: "Prihod uspješno obrisan" });
    } else {
      res.json({ message: "Prihod nije pronađen." });
    }
  } catch (err) {
    console.error("Greška prilikom brisanja prihoda:", err);
    res.json({ success: false, message: "Greška prilikom brisanja prihoda" });
  }
});

app.delete("/detaljiRashoda/:id", async (req, res) => {
  try {
    let id = req.params.id; // Dohvaćanje ID-a prihoda iz URL parametara
    console.log(id);
    let db = await connect();

    let rezultat = await db
      .collection("rashodi")
      .deleteOne({ _id: new BSON.ObjectId(id) }); // Brisanje prihoda iz baze podataka
    if (rezultat.deletedCount === 1) {
      res.json({ success: true, message: "Rashod uspješno obrisan" });
    } else {
      res.json({ message: "Rashod nije pronađen." });
    }
  } catch (err) {
    console.error("Greška prilikom brisanja rashoda:", err);
    res.json({ success: false, message: "Greška prilikom brisanja rashoda" });
  }
});

app.delete("/detaljiStednje/:id", async (req, res) => {
  try {
    let id = req.params.id;
    console.log(id);

    let db = await connect();
    let rezultat = db
      .collection("stednja")
      .deleteOne({ _id: new BSON.ObjectId(id) });
    if (rezultat.deletedCount === 1) {
      res.json({ success: true, message: "Štednja uspješno obrisana" });
    } else {
      res.json({ success: false, message: "Greška prilikom brisanja štednje" });
    }
  } catch (err) {
    res.json({ success: false, message: "Greška prilikom brisanja štednje" });
  }
});

app.listen(port, () => console.log(`Listening on port ${port}`));
