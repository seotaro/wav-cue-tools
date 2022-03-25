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

// 再帰的にオブジェクトを key=value 形式で連結して返す。
const keyValue = (objs) => {
  return Object.keys(objs).map(key => {
    return (objs[key] && (typeof objs[key] === 'object'))
      ? `${key}=[${keyValue(objs[key])}]`
      : (objs[key] == null) ? `${key}=${objs[key]}` : `${key}="${objs[key]}"`
  }).join(',')
}

console.log(tracks.map(track => keyValue(track)).join('\n'));
