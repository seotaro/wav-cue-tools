'use strict';

const parser = require('cue-parser-plus');

// トラック単位で集計して返す。
exports.parse = (path) => {
  const cuesheet = parser.parse(path);

  const attributes = {
    album_title: cuesheet.title
    , album_artist: cuesheet.performer
    , comment: ''
    , discid: ''
    , date: ''
    , genre: ''
    , discnumber: 1
    , totaldiscs: 1
    , tracktotal: ''

    , track_number: ''
    , track_artist: cuesheet.performer
    , track_title: ''
    , songwriter: cuesheet.songWriter
    , composer: ''
    , file: ''
    , indexes: {}
    , start: '00:00:00.000'
    , end: '00:00:00.000'

    , ...formatRems(cuesheet.rems)
  }

  return parseCuesheet(attributes, cuesheet);
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

    const trackAttributes = {
      ...attributes
      , file: file.name
      , track_number: track.number
      , track_title: track.title

      // INDEX は 番号をキーにする。
      , indexes:
        Object.assign({}
          , ...track.indexes.map((index) => ({ [index.number]: index.time }))
        )
      , ...formatRems(track.rems)
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

    ret.push(trackAttributes);
  }

  // トラックの終了時間を更新する。ファイルの最後のトラックは null になる。
  for (let i = 0; i < (ret.length - 1); i++) {
    const current = ret[i];
    const next = ret[i + 1];
    current.end = next.start;
  }
  ret[ret.length - 1].end = null;

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