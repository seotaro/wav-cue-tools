'use strict';

require('dotenv').config();
const parser = require('cue-parser-plus');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const cuesheetPath = process.argv[2];
const INPUT = path.dirname(cuesheetPath);
const cuesheet = parser.parse(cuesheetPath);

const OUTPUT = process.argv[3] || '.';
fs.mkdirSync(OUTPUT, { recursive: true });

const toAttributes = ((rems) => {
  const attributes = {};
  for (const key in rems) {
    attributes[key.toLowerCase()] = rems[key];
  }
  return attributes;
});

const toIndexes = ((src) => {
  const dest = {};
  for (const i in src) {
    dest[src[i].number] = src[i].time;
  }
  return dest;
});

const attributes = {
  album_title: cuesheet.title
  , album_artist: cuesheet.performer
  , track_artist: cuesheet.performer
  , comment: ''
  , discid: ''
  , date: ''
  , genre: ''
  , songwriter: cuesheet.songWriter
  , file: ''
  , track_title: ''
  , discnumber: '1'
  , totaldiscs: '1'
  , composer: ''
  , track_number: ''
  , tracktotal: ''
  , indexes: {}
  , start: '00:00:00.000'
  , end: '00:00:00.000'
  , ...toAttributes(cuesheet.rems)
}

const makeFfmpegCommandLine = (src, dest, attributes) => {
  const command = [
    `ffmpeg`,
    `-loglevel error`,
    `-y -i "${src}"`,

    `-ss ${attributes.start}`,
    attributes.end ? `-to ${attributes.end}` : '',

    `-metadata album="${attributes.album_title}"`,
    `-metadata album_artist="${attributes.album_artist}"`,
    `-metadata artist="${attributes.track_artist}"`,
    `-metadata comment=${attributes.comment}`,
    `-metadata date=${attributes.date}`,
    `-metadata discid="${attributes.discid}"`,
    `-metadata disc="${attributes.discnumber}"`,
    `-metadata genre="${attributes.genre}"`,
    `-metadata songwriter="${attributes.songwriter}"`,
    `-metadata title="${attributes.track_title}"`,
    `-metadata disctotal="${attributes.totaldiscs}"`,
    `-metadata composer=${attributes.composer}`,
    `-metadata tracktotal="${attributes.tracktotal}"`,
    `-metadata track="${attributes.track_number}"`,

    `"${dest}"`
  ];

  return command.join(' ');
}

const parseFile = (attributes, file) => {
  let dest = [];

  for (const j in file.tracks) {
    const track = file.tracks[j];

    const trackAttributes = {
      ...attributes
      , file: file.name
      , track_number: track.number
      , track_title: track.title
      , indexes: toIndexes(track.indexes)
      , ...toAttributes(track.rems)
    }
    if (track.performer) {
      trackAttributes.track_artist = track.performer;
    }
    if (track.songWriter) {
      trackAttributes.songwriter = track.songWriter;
    }
    if (trackAttributes.indexes['1']) {
      const index = trackAttributes.indexes['1'];
      const min = Number(index.min);
      trackAttributes.start = `${Math.floor(min / 60)}:${min % 60}:${index.sec}.${index.frame}`;
    }

    dest.push(trackAttributes);
  }

  for (let i = 0; i < (dest.length - 1); i++) {
    const current = dest[i];
    const next = dest[i + 1];
    current.end = next.start;
  }
  dest[dest.length - 1].end = null;

  return dest;
}

const parseCuesheet = (attributes, cuesheet) => {
  let dest = [];

  for (const i in cuesheet.files) {
    const file = cuesheet.files[i];
    dest.push(...parseFile(attributes, file));
  }
  dest.forEach(x => { x.tracktotal = dest.length; })

  return dest;
}

// トラックを集計する。
let tracks = parseCuesheet(attributes, cuesheet);

// 出力フォルダー
const dir = path.join(
  OUTPUT
  , attributes.genre.replace(/\//g, '-')
  , attributes.album_artist.replace(/\//g, '-')
  , attributes.album_title.replace(/\//g, '-'));
fs.mkdirSync(dir, { recursive: true });

// エンコード
console.log(cuesheetPath);
console.log(attributes.album_artist, attributes.album_title, attributes.discnumber);
for (let i = 0; i < tracks.length; i++) {
  const track = tracks[i];

  const src = path.join(INPUT, track.file);

  // const destName = `${track.track_number}.${track.track_title}.flac`;
  const destName = `${attributes.discnumber}-${track.track_number}.flac`;
  const dest = path.join(dir, destName.replace(/\//g, '-'));

  const command = makeFfmpegCommandLine(src, dest, track);
  console.log(track.track_number, track.track_title);
  execSync(command)
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
