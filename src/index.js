import express from "express";
import cors from "cors";
import connect from "./db";
import auth from "./auth";
import { BSON } from "mongodb";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/test", (req, res) => {
  res.send("Baza je okej");
});
// registracija
app.post("/korisnici", async (req, res) => {
  let korisnik = req.body;
  try {
    let user = await auth.registerUser(korisnik);
    // dodjeljivanje korisnickog id prilikom registracije i postavljanje pocetnog stanja
    let pocetnoStanje = {
      userId: user._id,
      stanje: 0,
      prihodi: 0,
      rashodi: 0,
      stednja: 0,
    };
    let db = await connect();
    await db.collection("stanjeRacuna").insertOne(pocetnoStanje);
    res.json({ user: user });
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

app.patch("/urediKorisnika", [auth.verify], async (req, res) => {
  let changes = req.body;

  try {
    await auth.promijeniPodatke(changes);
    res.status(200).json({ message: "Podaci uspješno ažurirani" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// provjera da li je potpis valjan
app.get("/tajna", [auth.verify], async (req, res) => {
  res.json({ message: "Ovo je tajna " + req.jwt.username });
});

// vraća mi prihode sa backenda u jsonu
app.get("/:id", [auth.verify], async (req, res) => {
  let id = req.params.id;
  try {
    let db = await connect();
    let data = await db
      .collection("stanjeRacuna")
      .findOne({ userId: new BSON.ObjectId(id) });
    res.json(data);
  } catch (error) {
    console.error("Greška prilikom dohvaćanja stanja: ", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/pregledPrihoda/:id", async (req, res) => {
  let userId = req.params.id;
  try {
    let db = await connect();
    let cursor = await db.collection("prihodi").find({ userId: userId });
    let data = await cursor.toArray();
    res.json(data);
  } catch (error) {
    console.error("Greška prilikom dohvaćanja prihoda: ", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/pregledRashoda/:id", async (req, res) => {
  let userId = req.params.id;
  try {
    let db = await connect();
    let cursor = await db.collection("rashodi").find({ userId: userId });
    let data = await cursor.toArray();
    res.json(data);
  } catch (error) {
    console.error("Greška prilikom dohvaćanja prihoda: ", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/pregledStednji/:id", async (req, res) => {
  let userId = req.params.id;
  try {
    let db = await connect();
    let cursor = await db.collection("stednja").find({ userId: userId });
    let data = await cursor.toArray();
    res.json(data);
  } catch (error) {
    console.error("Greška prilikom dohvaćanja štednji: ", error);
    res.status(500).json({ error: error.message });
  }
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
