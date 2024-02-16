const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://epuh:epuh@cluster0.laryrkw.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db = null;

export default async () => {
  if (db && client.isConnected) {
    console.log("Već spojeno");
    return db;
  } else {
    try {
      await client.connect();
      db = client.db("expense_track");
      console.log("Uspješno povezivanje na bazu podataka!");
      return db;
    } catch (error) {
      console.error("Greška prilikom povezivanja na bazu podataka:", error);
      throw error; // Odbacuje grešku kako bi se obradila na višoj razini
    }
  }
};