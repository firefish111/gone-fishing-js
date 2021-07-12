const load = require("./loadloot"),
  rl = require("readline-sync");

const level = { // the - rod
  "stringy": "string",
  "wooden": "wood",
  "bamboo": "bamboo",
  "icy": "ice",
  "brick": "brick",
  "rocky": "stone",
  "stainless steel": "iron",
  "copper": "copper",
  "silver": "silver",
  "golden": "gold",
  "platinum": "platinum",
  // rods from here can fish using bait
  "ruby": "ruby",
  "emerald": "emerald",
  "sapphire": "sapphire",
  "diamond": "diamonds",
  "rod on a": "fishing rods", // very op don't ask why
};

let data;

const save = rl.keyInYN("Do you have a save? ");
if (save) {
  data = rl
      .question("Please paste your save here. (to paste in a terminal use Shift-Insert)\n> ")
      .split(/[$\[\]:]/g)
      .map((i, ix) => ix === 0 ? parseInt(i, 16) : Number(i));
} else data = Array(14).fill(0);

console.clear();

let rod = data[0],
  money = data[1],
  // measures how much bait you have. can be made using 21 money.
  bait = data[data.length - 1];

const cost = 21, // cost in $ of the bait
  fish = {
    salmon: data[2],
    tuna: data[3],
    cod: data[4],
    mackerel: data[5],
    haddock: data[6],
  },
  opfish = {
    carp: data[8],
    trout: data[9],
    whale: data[10],
    shark: data[11],
  },
  sellprice = {
    carp: 15, // $15 per carp
    trout: 25, // $25 per trout
    whale: 40, // $40 per whale
    shark: 60 + Math.ceil(Math.random() * 10), // $60 - $170 per shark
  };

console.log(data);

let tbl = load.rodtable(rod);

const cast = () => {
  console.log(`\nCasting your ${Object.keys(level)[rod]} rod...\n`);

  let caught,
    baityn = false; // yesn't
  if (rod > 10) {
    baityn = rl.keyInYN("Use some bait to catch better fish?\n\t(You can't catch rod upgrades when using bait)");

    if (baityn) {
      if (bait > 0) {
        caught = load.calculate(tbl.bait);
        bait--;
      } else {
        console.log("You don't have any bait. You can buy bait at the market for $21 per piece.");
        return;
      }
    } else {
      caught = load.calculate(tbl.norm);
    }
  } else {
    caught = load.calculate(tbl);
  }

  console.log(`You caught some ${caught}!\n`);

  if (Object.values(level)[rod + 1] === caught) {
    const ify = rl.keyInYN(`You can upgrade your rod now, to fish better items. Do it now, or sell the ${caught}?\n> `);
    if (ify) {
      console.log(`You have upgraded your fishing rod to a ${Object.keys(level)[++rod]} rod`);
      tbl = load.rodtable(rod);
    } else {
      money += rod + 1;
      console.log(`You sold the ${caught} for \$${rod + 1}!`);
    }
  } else if (caught === "junk") {
    const j = Math.ceil(Math.random() * 5);
    money += j;
    console.log(`You sold the junk for \$${j}!`);
  } else {
    (baityn ? opfish : fish)[caught]++;
  }
};

console.log(`You start with a ${Object.keys(level)[rod]} rod!`);

while (true) {
  console.log("Press enter to fish, m to go to the market, or x to save and exit.");

  const input = rl.question("> ");

  if (input === "") {
    cast();
  } else if (input == "m") {
    console.log(`You have \$${money}. You have ${bait} bait.\n\n`);

    if (money >= cost) {
      console.log(`\n\n\nYou can buy ${Math.floor(money / cost)} bait.`);
      const amount = Number(rl.question("How much bait would you like to buy? "));

      if (amount <= Math.floor(money / cost)) {
        money -= amount * cost;
        bait += amount;
      } else {
        console.log("Unfortunately, you can't afford that much bait.\n\tEither try buying less, or try selling some of your fish.");
      }
    } else console.log("You can't afford any bait. Bait costs $21 per piece.");


    if (!(Object.values(opfish).every(ky => ky === 0))) {
      console.log("\n\n\n\nIt seems as if you have some big fish to sell. Here is what you have:");

      for (const bigfish in opfish) {
        console.log(`You have ${opfish[bigfish]} ${bigfish}, which you can sell for \$${sellprice[bigfish]} per piece`);
      }

      console.log("What would you like to sell?");

      Object.keys(opfish).forEach((itm, ix) => {
        console.log(`\tPress ${ix+1} to sell ${itm},`);
      });
      console.log("Or press enter to not sell anything.");

      let ip = rl.question("> ");
      try {
        ip = Number(ip) - 1;
        const inq = Object.keys(opfish)[ip];

        if (ip >= inq.length) throw ip;

        const amnt = Number(rl.question(`How much ${inq} would you like to sell? (you currently have ${opfish[inq]})`));

        if (amnt > opfish[inq]) {
          console.log(`You don't have that much ${inq}!`);
          throw ammt;
        } else {
          opfish[inq] -= amnt;
          money += sellprice[inq] * amnt;
        }
      } catch (e) {
        console.log("\x1b[38;5;1mDEBUG: Not selling anything.\x1b[0m", e);
      }
    }
  } else if (input == "x") {
    console.log(`\n\n\n\n\n\n\n\nGoodbye. Here is your save:\n\n\n\n${rod.toString(16)}\$${money}[${Object.values(fish).join(":")}][${Object.values(opfish).join(":")}]${bait}`);
    process.exit();
  }
}
