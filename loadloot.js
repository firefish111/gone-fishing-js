const f = require("fs");

module.exports = {
  table: loot => JSON.parse(f.readFileSync(`./loot/${loot}.json`).toString()),

  rodtable: function(num) { // javascript in a nutshell
    return this.table(`lv${num}rod`);
  },

  calculate: table => {
    let d = Math.random();
    for (itm in table) {
      d -= table[itm];
      if (d <= 0) {
        return itm;
        break;
      }
    }
  }
}