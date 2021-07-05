const load = require("./loadloot"),
      rl   = require("readline-sync");

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
  "rod on a": "fishing rods" // very op don't ask why
};

let data;

let save = rl.keyInYN("Do you have a save? ");
if (save)
  data = rl.question("Please paste your save here. (to paste in a terminal use Shift-Insert)\n> ").split(/[$\[\]:]/g).map((i, ix) => ix === 0 ? parseInt(i, 16) : Number(i));
else data = Array(10).fill(0);

console.clear();

let rod  = data[0],
    money = data[1],
    bait = data[data.length - 1]; // measures how much bait you have. can be made using 21 money.

const cost = 21; // cost in $ of the bait


const fish = {
  salmon: data[2],
  trout: data[3],
  cod: data[4],
  mackerel: data[5],
  haddock: data[6],
}

// op fish, that can be caught with bait
const opfish = {
  carp: data[7],
}


let tbl = load.rodtable(rod);

let cast = () => {
  console.log(`\nCasting your ${Object.keys(level)[rod]} rod...\n`);
  
  let caught; // yesn't
  if (rod > 10) {
    let baityn = rl.keyInYN(`Use some bait to catch better fish?\n\t(You can't catch rod upgrades when using bait)`);
    
    if (baityn) {
      if (bait > 0) {
        caught = load.calculate(tbl.bait)
      } else {
        console.log("You can't afford any bait. You can buy bait at the market for $21 per piece.");
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
    let ify = rl.keyInYN(`You can upgrade your rod now, to fish better items. Do it now, or sell the ${caught}?\n> `);

    if (ify) {
      console.log(`You have upgraded your fishing rod to a ${Object.keys(level)[++rod]} rod`);
      tbl = load.rodtable(rod);
    } else {
      money += rod + 1;
      console.log(`You sold the ${caught} for \$${rod + 1}!`);
    }

  } else if (caught === "junk") {
    let j = Math.ceil(Math.random() * 5);
    money += j;
    console.log(`You sold the junk for \$${j}!`)
  } else {
    fish[caught]++;
  }
} 

console.log(`You start with a ${Object.keys(level)[rod]} rod!`);

while (true) {
  console.log("Press enter to fish, m to go to the market, or x to save and exit.");

  let input = rl.question("> ");

  if (input === "") {
    cast();
  } else if (input == "m") {
    console.log(`You have \$${money}. Here is your fish:`, fish);
    if (money >= cost) {
      console.log(`\n\n\nYou can buy ${Math.floor(money / cost)} bait.`);
      let amount = Number(rl.question("How much bait would you like to buy? "));

      if (amount <= Math.floor(money / cost)) {
        money -= amount * cost;
        bait += amount;
      } else {
        console.log("Unfortunately, you can't afford that much bait.\n\tEither try buying less, or try selling some of your fish.");
      }
    } else console.log("You can't afford any bait. Bait costs $21 per piece ")
  } else if (input == "x") {
    console.log(`\n\n\n\n\n\n\n\nGoodbye. Here is your save:\n\n\n\n${rod.toString(16)}\$${money}[${Object.values(fish).join(":")}][${Object.values(fish).join(":")}${bait}`);
    process.exit()
  }
}