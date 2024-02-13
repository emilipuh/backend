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
      id: 1,
      kategorija: "Plaća",
      iznos: 1500,
      datum: "2023 - 12 - 15",
      biljeska: "",
    },
    {
      id: 2,
      kategorija: "Ostalo",
      iznos: 150,
      datum: "2023 - 12 - 15",
      biljeska: "Prihod od rentanja stana",
    },
  ],
  rashodi: [
    {
      id: 11,
      kategorija: "Vozilo",
      iznos: 50,
      datum: "2023 - 12 - 15",
      biljeska: "Trošak tankanja",
    },
    {
      id: 12,
      kategorija: "Kupovina",
      iznos: 70,
      datum: "2023 - 12 - 15",
      biljeska: "Tjedna kupnja namirnica",
    },
    {
      id: 13,
      kategorija: "Edukacija",
      iznos: 30,
      datum: "2023 - 12 - 15",
      biljeska: "Mjesečna uplata za tečaj",
    },
  ],

  stednja: [
    {
      id: 111,
      iznos: 200,
      datum: "2023 - 12 - 15",
      biljeska: "Mjesečna štednja",
    },
  ],
};

export default podaci;
