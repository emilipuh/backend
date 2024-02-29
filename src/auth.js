import bcrypt from "bcrypt";
import connect from "./db";

// moramo provjeriti ako korisnik već postoji, ali nećemo
// to provjeravati u export defaultu da se to ne bi
// izvršavalo svaki put kada se aplikacija pokrene
// ili zatraži korisnik

// napravili smo asinkronu funkciju
(async () => {
  let db = await connect();
  await db
    .collection("korisnici")
    .createIndex({ korisnicko_ime: 1 }, { unique: true }); // unique moraju biti i korisnicko ime i email
})(); // i ovdje smo je pozvali na izvršavanje

export default {
  async registracija(korisnicki_podaci) {
    let db = await connect();

    let korisnik = {
      email: korisnicki_podaci.email,
      korisnicko_ime: korisnicki_podaci.korisnicko_ime,
      lozinka: await bcrypt.hash(korisnicki_podaci.password, 8),
    };
    // ovo omotamo u try catch da ne dobivamo greške u konzoli
    try {
      let rezultat = await db.collection("korisnici").insertOne(korisnik);
      if (rezultat && rezultat.insertedId) {
        return rezultat.insertedId;
      }
    } catch (err) {
      if (err.code == 11000) {
        throw new Error("Korisnik već postoji");
      }
    }
  },
};
