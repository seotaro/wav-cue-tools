'use strict';

const cuesheet = require('./cuesheet.js');

describe('ffmpegMetadata unit tests', () => {
  test('empty', () => {
    const src = {}
    const dest = [];
    expect(cuesheet.ffmpegMetadata(src)).toEqual(dest);
  });

  test('empty text', () => {
    const src = {
      album_title: '',
      album_artist: '',
      track_artist: '',
      comment: '',
      date: '',
      discid: '',
      discnumber: '',
      genre: '',
      songwriter: '',
      track_title: '',
      totaldiscs: '',
      composer: '',
      tracktotal: '',
      track_number: '',
    }

    const dest = [];

    expect(cuesheet.ffmpegMetadata(src)).toEqual(dest);
  });

  test('null', () => {
    const src = {
      album_title: null,
      album_artist: null,
      track_artist: null,
      comment: null,
      date: null,
      discid: null,
      discnumber: null,
      genre: null,
      songwriter: null,
      track_title: null,
      totaldiscs: null,
      composer: null,
      tracktotal: null,
      track_number: null,
    }

    const dest = [];

    expect(cuesheet.ffmpegMetadata(src)).toEqual(dest);
  });

  test('full', () => {
    const src = {
      album_title: '1111111',
      album_artist: '222222',
      track_artist: '33333333',
      comment: '444444',
      date: '555555',
      discid: '6666666',
      discnumber: '777777777',
      genre: '88888888',
      songwriter: '99999',
      track_title: 'AAAAAAAAA',
      totaldiscs: 'BBBBBBBBB',
      composer: 'CCCCCCCCCC',
      tracktotal: 'DDDDDDDD',
      track_number: 'EEEEEEEEE',
    }

    const dest = [
      '-metadata album="1111111"',
      '-metadata album_artist="222222"',
      '-metadata artist="33333333"',
      '-metadata comment="444444"',
      '-metadata date="555555"',
      '-metadata discid="6666666"',
      '-metadata disc="777777777"',
      '-metadata genre="88888888"',
      '-metadata songwriter="99999"',
      '-metadata title="AAAAAAAAA"',
      '-metadata disctotal="BBBBBBBBB"',
      '-metadata composer="CCCCCCCCCC"',
      '-metadata tracktotal="DDDDDDDD"',
      '-metadata track="EEEEEEEEE"',
    ];

    expect(cuesheet.ffmpegMetadata(src)).toEqual(dest);
  });

  test('escape', () => {
    const src = {
      album_title: '`1111111',
      album_artist: '222222`',
      track_artist: '`33333333`',
      comment: '```444```444```',
      date: '`',
      discid: '``````',
    }

    const dest = [
      '-metadata album="\\`1111111"',
      '-metadata album_artist="222222\\`"',
      '-metadata artist="\\`33333333\\`"',
      '-metadata comment="\\`\\`\\`444\\`\\`\\`444\\`\\`\\`"',
      '-metadata date="\\`"',
      '-metadata discid="\\`\\`\\`\\`\\`\\`"',
    ];

    expect(cuesheet.ffmpegMetadata(src)).toEqual(dest);
  });
});

