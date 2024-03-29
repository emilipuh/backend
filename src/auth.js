import dotenv from "dotenv";
dotenv.config(); // za iščitavanje JWT_SECRET iz .env, ide u gitignore

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import connect from "./db";
import mongo, { ObjectId, BSON } from "mongodb";
import { response } from "express";

// moramo provjeriti ako korisnik već postoji, ali nećemo
// to provjeravati u export defaultu da se to ne bi
// izvršavalo svaki put kada se aplikacija pokrene
// ili zatraži korisnik

// napravili smo asinkronu funkciju
(async () => {
  let db = await connect();
  await db
    .collection("korisnici")
    .createIndex({ username: 1 }, { unique: true }); // unique moraju biti i korisnicko ime i email
})(); // i ovdje smo je pozvali na izvršavanje

export default {
  async registerUser(user_data) {
    let db = await connect();
    let user = {
      email: user_data.email,
      username: user_data.username,
      password: await bcrypt.hash(user_data.password, 8), // solimo osam puta
    };
    // ovo omotamo u try catch da ne dobivamo greške u konzoli
    try {
      let rezultat = await db.collection("korisnici").insertOne(user);
      if (rezultat && rezultat.insertedId) {
        return user;
      }
    } catch (err) {
      if (err.code == 11000) {
        throw new Error("Korisnik već postoji");
      }
    }
  },
  async authenticateUser(username, password) {
    // podaci koje dobijemo sa frontenda
    let db = await connect();
    let user = await db.collection("korisnici").findOne({ username: username }); // pretraga po usernameu kojeg smo dobili sa frontenda
    if (
      user &&
      user.password &&
      (await bcrypt.compare(password, user.password)) // password, user.password i obrnuto nije isto
    ) {
      delete user.password;
      // ako postoji user, ako postoji pass i ako se dobiven pass sa frontenda podudara sa onim kriptiranim passom u bazi
      // izdajemo token
      let token = jwt.sign(user, process.env.JWT_SECRET, {
        algorithm: "HS512",
        expiresIn: "1 week",
      });
      return {
        token,
        username: user.username,
        email: user.email,
        id: user._id,
      };
    } else {
      throw new Error("Cannot authenticate");
    }
  },
  verify(req, res, next) {
    // next je za express middleware
    try {
      let authorization = req.headers.authorization.split(" ");
      let type = authorization[0];
      let token = authorization[1];
      if (type !== "Bearer") {
        return res.status(401).send();
      } else {
        req.jwt = jwt.verify(token, process.env.JWT_SECRET);
        next();
      }
    } catch (e) {
      return res.status(401).send();
    }
  },
  async promijeniPodatke(podaci) {
    try {
      let novi_username = podaci.username;
      let novi_email = podaci.email;
      let stara_lozinka = podaci.stara_lozinka;
      let nova_lozinka = podaci.nova_lozinka;

      let db = await connect();
      let user = await db
        .collection("korisnici")
        .findOne({ _id: new BSON.ObjectId(podaci.userId) });

      if (!user) {
        throw new Error("Korisnik nije pronađen");
      }

      if (stara_lozinka && nova_lozinka) {
        if (!(await bcrypt.compare(stara_lozinka, user.password))) {
          throw new Error("Stara lozinka nije točna");
        }

        let nova_lozinka_hashed = await bcrypt.hash(nova_lozinka, 8);

        await db
          .collection("korisnici")
          .updateOne(
            { _id: user._id },
            { $set: { password: nova_lozinka_hashed } }
          );
      }

      if (novi_username && novi_username !== user.username) {
        await db
          .collection("korisnici")
          .updateOne({ _id: user._id }, { $set: { username: novi_username } });
      }

      if (novi_email && novi_email !== user.email) {
        await db
          .collection("korisnici")
          .updateOne({ _id: user._id }, { $set: { email: novi_email } });
      }

      return "Podaci uspješno ažurirani";
    } catch (error) {
      console.error("Greška prilikom ažuriranja podataka:", error);
      throw new Error(error);
    }
  },
};
