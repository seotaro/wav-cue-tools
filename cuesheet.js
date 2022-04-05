'use strict';

const parser = require('cue-parser-plus');

// トラック単位で集計して返す。
exports.parse = (path) => {
  const cuesheet = parser.parse(path);

  const attributes = {
    // REM 以外の cue コマンドを内部コマンドにマッピングする
    album_title: cuesheet.title ? cuesheet.title : 'unknown'
    , album_artist: cuesheet.performer ? cuesheet.performer : 'unknown'
    , track_artist: cuesheet.performer ? cuesheet.performer : 'unknown'
    , songwriter: cuesheet.songWriter ? cuesheet.songWriter : 'unknown'

    , discnumber: '1'
    , totaldiscs: '1'

    , ...formatRems(cuesheet.rems)
  }

  return parseCuesheet(attributes, cuesheet);
}

// ffmpeg の metadata にマップする。
exports.ffmpegMetadata = (attributes) => {
  const metadatas = [
    attributes.album_title ? `-metadata album="${attributes.album_title}"` : null,
    attributes.album_artist ? `-metadata album_artist="${attributes.album_artist}"` : null,
    attributes.track_artist ? `-metadata artist="${attributes.track_artist}"` : null,
    attributes.comment ? `-metadata comment="${attributes.comment}"` : null,
    attributes.date ? `-metadata date="${attributes.date}"` : null,
    attributes.discid ? `-metadata discid="${attributes.discid}"` : null,
    attributes.discnumber ? `-metadata disc="${attributes.discnumber}"` : null,
    attributes.genre ? `-metadata genre="${attributes.genre}"` : null,
    attributes.songwriter ? `-metadata songwriter="${attributes.songwriter}"` : null,
    attributes.track_title ? `-metadata title="${attributes.track_title}"` : null,
    attributes.totaldiscs ? `-metadata disctotal="${attributes.totaldiscs}"` : null,
    attributes.composer ? `-metadata composer="${attributes.composer}"` : null,
    attributes.tracktotal ? `-metadata tracktotal="${attributes.tracktotal}"` : null,
    attributes.track_number ? `-metadata track="${attributes.track_number}"` : null,
  ];

  // エスケープして返す。
  return metadatas
    .filter(metadata => metadata)
    .map(metadata => metadata.replace(/`/g, '\\`'));
}


const parseCuesheet = (attributes, cuesheet) => {
  let ret = [];

  cuesheet.files.forEach(file => {
    ret.push(...parseFile(attributes, file));
  });
  ret.forEach(x => { x.tracktotal = ret.length; })

  return ret;
}

const parseFile = (attributes, file) => {
  let ret = [];

  for (const j in file.tracks) {
    const track = file.tracks[j];

    // INDEX は 番号をキーにする。
    const indexes = Object.assign({}, ...track.indexes.map((index) => ({
      [index.number]:
        ((time) => {
          const t = Number(time.min);
          const hour = Math.floor(t / 60);
          const min = t % 60;
          return `${padding(hour, 2)}:${padding(min, 2)}:${padding(time.sec, 2)}.${padding(time.frame, 2)}`;
        })(index.time)
    })));

    const trackAttributes = {
      ...attributes

      , file: file.name
      , track_number: track.number ? track.number : 'unknown'
      , track_artist: track.performer ? track.performer : attributes.album_artist
      , track_title: track.title ? track.title : 'unknown'
      , songwriter: track.songWriter ? track.songWriter : attributes.songwriter
      , isrc: track.isrc ? track.isrc : 'unknown'
      , indexes
      , start: indexes['1'] ? indexes['1'] : '00:00:00.000'
      , end: null

      , ...formatRems(track.rems)
    }

    ret.push(trackAttributes);
  }

  // トラックの終了時間を更新する。ファイルの最後のトラックは null になる。
  for (let i = 0; i < (ret.length - 1); i++) {
    const current = ret[i];
    const next = ret[i + 1];
    current.end = next.start;
  }

  return ret;
}

// REMS を整形する。
// ・キーを小文字にする
// ・前後のダブルクォーテーションを削除する
const formatRems = ((rems) => {
  return rems
    ? Object.fromEntries(
      Object.entries(rems)
        .map(([key, rem]) => [key.toLowerCase(), rem.replace(/^\"|\"$/g, '')])
    )
    : null;
});

// ゼロパディング
function padding(value, digit) {
  return (Array(digit).join('0') + value).slice(-digit);
}
