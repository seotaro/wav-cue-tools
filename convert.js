'use strict';

const cuesheet = require('./cuesheet.js');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 引数チェック
if ((process.argv.length < 4) || (7 < process.argv.length)) {
  const basename = path.basename(process.argv[1]);

  console.error(`Usage: node ${basename} cuesheet output [extent] [ffmpeg-options]`);
  process.exit(1);
}

const CUESHEET_PATH = process.argv[2];
const INPUT = path.dirname(CUESHEET_PATH);
const OUTPUT = process.argv[3] || '.';
const EXTENT = process.argv[4] || 'wav';
const OPTIONS = process.argv[5] || null;

// トラック単位で集計する。
const tracks = cuesheet.parse(CUESHEET_PATH);

// 出力フォルダー
const firstTrack = tracks[0]; // 最初のトラックで代表する
const dir = path.join(
  OUTPUT
  , firstTrack.genre.replace(/\//g, '-')
  , firstTrack.album_artist.replace(/\//g, '-')
  , firstTrack.album_title.replace(/\//g, '-'));
fs.mkdirSync(dir, { recursive: true });

// エンコード
console.log(CUESHEET_PATH);
for (let i = 0; i < tracks.length; i++) {
  const track = tracks[i];

  const src = path.join(INPUT, track.file);

  // const destName = `${track.track_number}.${track.track_title}.${EXTENT}`;
  const destName = `${firstTrack.discnumber}-${track.track_number}.${EXTENT}`;
  const dest = path.join(dir, destName.replace(/\//g, '-'));

  const commandline = [
    `ffmpeg`,
    `-loglevel error`,
    `-y -i "${src}"`,

    `-ss ${track.start}`,
    track.end ? `-to ${track.end}` : '',

    cuesheet.ffmpegMetadata(track).join(' '),

    OPTIONS ? OPTIONS : '',

    `"${dest}"`
  ].join(' ');

  try {
    execSync(commandline)
  } catch (error) {
    console.error(error);
  }
}

// カバーアート
{
  const src = path.join(INPUT, 'front.jpg');
  if (fs.existsSync(src)) {
    const dest = path.join(dir, 'front.jpg');

    fs.copyFile(src, dest, (err) => {
      if (err) {
        console.error('error copy front.jpg', err);
      };
    });
  }
}
