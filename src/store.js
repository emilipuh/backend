// hardkodirana "baza" dok se ne povežemo na mongodb

let podaci = {
  stanje: {
    stanjeRacuna: 1800,
    prihodi: 1650,
    rashodi: 150,
    stednja: 400,
  },
  prihodi: [
    {
      kategorija: "Plaća",
      iznos: 1500,
      datum: "2023 - 12 - 15",
      biljeska: "",
    },
    {
      kategorija: "Ostalo",
      iznos: 150,
      datum: "2023 - 12 - 15",
      biljeska: "Prihod od rentanja stana",
    },
  ],
  rashodi: [
    {
      kategorija: "Vozilo",
      iznos: 50,
      datum: "2023 - 12 - 15",
      biljeska: "Trošak tankanja",
    },
    {
      kategorija: "Kupovina",
      iznos: 70,
      datum: "2023 - 12 - 15",
      biljeska: "Tjedna kupnja namirnica",
    },
    {
      kategorija: "Edukacija",
      iznos: 30,
      datum: "2023 - 12 - 15",
      biljeska: "Mjesečna uplata za tečaj",
    },
  ],

  stednja: [
    {
      iznos: 200,
      datum: "2023 - 12 - 15",
      biljeska: "Mjesečna štednja",
    },
  ],
};

export default podaci;
