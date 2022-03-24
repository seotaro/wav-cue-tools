'use strict';

const path = require('path');
const cuesheet = require('./cuesheet.js');

// 引数チェック
if (process.argv.length !== 3) {
  const basename = path.basename(process.argv[1]);

  console.error(`Usage: node ${basename} cuesheet`);
  process.exit(1);
}

const tracks = cuesheet.parse(process.argv[2]);

console.log(tracks);