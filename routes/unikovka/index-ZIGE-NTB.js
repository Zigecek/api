const express = require("express");
const mongoose = require("mongoose");
var cors = require("cors");
const Team = require("../../models/team");
const Odpoved = require("../../models/odpoved");
const shortid = require("shortid");
const Sos = require("../../models/sos");

const unikovka = express.Router();

const stanovisteBuilder = {
  NU1: 0,
  NU2: 0,
  NJID: 0,
  NCHOD: 0,
  BU1B: 0,
  BU2B: 0,
  BU3B: 0,
  BCHOD: 0,
  SKL1: 0,
  SKL2: 0,
  SKLCHOD: 0,
};

const Budova = {
  Nova: 0,
  Stara: 1,
};

const pocetUkolu = 11;

unikovka.use(cors());

unikovka.post("/registrace", async (req, res) => {
  const { cleni } = req.body;
  let uuid = shortid.generate(); // Vygenerovani unikatniho ID

  let stanoviste = await noveStanoviste({
    // Vygenerovani noveho stanoviste
    team_id: uuid,
    stanoviste: {
      aktualni: "",
      navstivene: [],
    },
  });
  const team = new Team({
    // Vytvoreni noveho teamu v databazi
    _id: mongoose.Types.ObjectId(),
    team_id: uuid,
    stanoviste: {
      aktualni: stanoviste,
      navstivene: [],
    },
    cleni,
    pocetUkolu: 0,
    vytvoren: Date.now(),
  });
  team.save(); // Ulozeni teamu do databaze

  res.status(200).send(team);
});

unikovka.post("/odpoved", async (req, res) => {
  const [team_id, odpoved_content] = [req.body.team_id, req.body.odpoved]; // Ziskani dat z requestu
  let otazka; // Deklarace promenne pro otazku
  if (odpoved_content == null) {
    // Pokud je odpoved null
    otazka = {
      // pokud nebyla odpoved povinna
      required: false, // Nastav otazku na nepovinnou
    };
  } else {
    // Pokud byla odpoved povinna
    otazka = {
      // Nastav otazku na povinnou a uloz odpoved
      required: true,
      right: odpoved_content,
    };
  }

  let team = await Team.findOne({ team_id }); // Ziskani teamu z databaze

  if (!team) {
    // Pokud nebyl team nalezen
    res.status(404).send({ error: "Team nebyl nalezen" }); // Vrat chybu
    return;
  }

  const odpoved = new Odpoved({
    // Vytvoreni objektu v databazi
    _id: mongoose.Types.ObjectId(),
    otazka,
    team_id,
    stanoviste: team.stanoviste.aktualni, // Ziskani aktualniho stanoviste
  });
  odpoved.save(); // Ulozeni odpovedi do databaze

  if (team.splneneUkoly != pocetUkolu - 1) {
    // Pokud neni team na poslednim ukolu
    let nove = await noveStanoviste(team); // Ziskani noveho stanoviste pro team
    if (nove == false) {
      // Pokud zadne stanoviste neni dostupne
      res.status(200).send({ error: "Žádné stanoviště není dostupné" });
      //???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
    } else {
      // Pokud je dostupne upravime team v databazi
      team.stanoviste.aktualni = nove;
      team.stanoviste.navstivene.push(nove);
      team.splneneUkoly++; // Zvys pocet splnenych ukolu
      team.save();
      res.status(200).send({ stanoviste: nove });
    }
    team.save(); // Uloz team do databaze
  } else {
    // Pokud je team na poslednim ukolu
    team.splneneUkoly == pocetUkolu; // Nastav pocet splnenych ukolu na pocet ukolu
    team.dokonceno.limit = false;
    team.dokonceno.cas = Date.now();
    team.save(); // Uloz team do databaze
    res.status(200).send({ stanoviste: "Konec" });
  }
});

unikovka.get("/vysledky", async (req, res) => {
  // Vytvoreni endpointu pro ziskani vysledku
  let teamy = await Team.find({}); // Ziskani vsech teamu z databaze
  let odpovedi = await Odpoved.find({}); // Ziskani vsech odpovedi z databaze
  let vysledky = [];
  for (let i = 0; i < teamy.length; i++) {
    // Pro kazdy team
    let team = teamy[i];
    team.odpovedi = odpovedi.filter((o) => o.team_id == team.team_id); // Ziskani odpovedi pro team
    vysledky.push(team); // Pridani teamu s odpovedmi do vysledku
  }
  res.status(200).send(vysledky);
});

unikovka.post("/sos", async (req, res) => {
  const { team_id } = req.body; // Ziskani dat z requestu
  let team = await Team.findOne({ team_id }); // Ziskani teamu z databaze
  if (!team) {
    // Pokud nebyl team nalezen
    res.status(404).send({ error: "Team nebyl nalezen" }); // Vrat chybu
    return;
  }
  const sos = new Sos({
    // Vytvoreni objektu v databazi
    _id: mongoose.Types.ObjectId(),
    stanoviste: team.stanoviste.aktualni, // Ziskani aktualniho stanoviste
    cas: Date.now(),
  });
  sos.save(); // Ulozeni sosu do databaze
  res.status(200).send({ status: "OK" });
});

unikovka.get("/sos", async (req, res) => {
  let soska = await Sos.find({}); // Ziskani vsech sosu z databaze
  req.status(200).send(
    soska.map((x) => {
      x.cas = Date.now() - x.cas;
    })
  ); // Vrat vsechny sos z databaze
});

async function noveStanoviste(vyzadovany_team) {
  let teamy = await Team.find({}); // Vsechny teamy
  teamy = teamy.filter((t) => t.team_id != vyzadovany_team.team_id); // Vsechny teamy krome aktualniho
  let stanovisteStaty = stanovisteBuilder; // Pocet navstiveni jednotlivych stanovist

  console.log(stanovisteStaty);

  if (teamy.length != 0) {
    for (let i = 0; i < teamy.length; i++) {
      // Projdi vsechny teamy
      let team = teamy[i];
      for (let j = 0; j < Object.keys(stanovisteStaty).length; j++) {
        // Projdi vsechny stanoviste
        let stanoviste = Object.keys(stanovisteStaty)[j];
        if (team.stanoviste.aktualni == stanoviste) {
          // Pokud je aktualni stanoviste stejne jako aktualni stanoviste v cyklu
          stanovisteStaty[stanoviste] = false; // Nastav pocet navstiveni na false
        } else {
          if (team.stanoviste.navstivene.includes(stanoviste)) {
            // Pokud je aktualni stanoviste v seznamu navstivenych stanovist
            if (stanovisteStaty[stanoviste] != false) {
              // Pokud je pocet navstiveni stanoviste jine nez false
              stanovisteStaty[stanoviste]++; // Zvys pocet navstiveni stanoviste
            }
          }
        }
      }
    }
  }

  let finalniStaty = {};
  Object.keys(stanovisteStaty).forEach((key) => {
    let value = stanovisteStaty[key];
    if (
      value !== false &&
      key !== vyzadovany_team.stanoviste.aktualni &&
      !vyzadovany_team.stanoviste.navstivene.includes(key)
    ) {
      // Pokud je pocet navstiveni stanoviste jine nez false a neni aktualni stanoviste
      finalniStaty[key] = value; // Pridani stanoviste do seznamu dostupnych stanovist
    }
  });

  if (Object.keys(finalniStaty).length == 0) {
    return false; // Zadne stanoviste neni dostupne
  }

  return navstiveni(
    rozdeleniPodleBudovy(finalniStaty, vyzadovany_team.stanoviste.aktualni)
  );
}

function budova(stanoviste) {
  // Zjisteni budovy stanoviste
  if (stanoviste.startsWith("N")) {
    return Budova.Nova;
  } else if (stanoviste.startsWith("B") || stanoviste.startsWith("S")) {
    return Budova.Stara;
  } else {
    return false;
  }
}

function rozdeleniPodleBudovy(staty, aktualni) {
  let novaBudova = {};
  let staraBudova = {};
  let aktualniBudova = budova(aktualni); // Zjisteni budovy aktualniho stanoviste

  for (const [key, value] of Object.entries(staty)) {
    // Projdi vsechny staty a rozdel je podle budovy
    if (budova(key) == Budova.Nova) {
      novaBudova[key] = value;
    } else if (budova(key) == Budova.Stara) {
      staraBudova[key] = value;
    }
  }

  if (Object.keys(novaBudova).length == 0) {
    // Pokud neni zadne stanoviste v nove budove
    return [staraBudova, novaBudova];
  } else if (Object.keys(staraBudova).length == 0) {
    // Pokud neni zadne stanoviste v stare budove
    return [novaBudova, staraBudova];
  }

  if (aktualniBudova) {
    // Pokud je aktualni stanoviste v nejake budove
    if (aktualniBudova == Budova.Nova) {
      return [novaBudova, staraBudova];
    } else if (aktualniBudova == Budova.Stara) {
      return [staraBudova, novaBudova];
    }
  } else {
    // Pokud neni aktualni stanoviste v nejake budove
    return [novaBudova, staraBudova];
  }
}

function navstiveni(budovyStaty) {
  let staty = budovyStaty[0];
  let nejvicNavstiveni = Object.keys(staty)[0];
  for (let i = 1; i < Object.keys(staty).length; i++) {
    // Projdi vsechny stanoviste
    let stanoviste = Object.keys(staty)[i];

    if (staty[stanoviste] > staty[nejvicNavstiveni]) {
      // Pokud je aktualni stanoviste navstiveno vice nez to nejvice navstevovane
      nejvicNavstiveni = stanoviste; // Nastav nejvice navstiveno na aktualni stanoviste
    }
  }
  return nejvicNavstiveni;
}

module.exports = unikovka;
