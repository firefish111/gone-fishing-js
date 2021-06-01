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
  "ruby": "ruby",
  "emerald": "emerald",
  "sapphire": "sapphire",
  "diamond": "diamond",
  "rod on a": "fishing rods" // very op don't ask why
};


let rod  = 0,
    money = 0,
    bait = 0; // measures how much bait you have. can be made using 21 money.

const cost = 21;


const fish = {
  salmon: 0,
  trout: 0,
  cod: 0,
  mackerel: 0,
  haddock: 0,
  whitebait: 0,
  carp: 0, // the op fish start here
}


let tbl = load.rodtable(rod);

let cast = () => {
  console.log(`\nCasting your ${Object.keys(level)[rod]} rod...\n`);

  let caught = load.calculate(tbl);
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

  if (input == "") {
    cast();
  } else if (input == "m") {
    console.log(`You have \$${money}. Here is your fish:`, fish);
    if (money >= cost) {
      console.log(`\n\n\nYou can buy ${Math.floor(money / cost)} bait.`);
      let amount = Number(rl.question("How much bait would you like to buy? "));

      if (amount <= Math.floor(money / cost)) {
        money -= amount * cost;
        bait += amount;
      }
    }
  } else if (input == "x") {
    console.log(`\n\n\n\n\n\n\n\nGoodbye. Here is your save:\n\n\n\n${rod.toString(16)}\$${money}[${Object.values(fish).join(":")}]${bait}`);
  }
}