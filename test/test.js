const path = require('path');
const cuesheet = require('../cuesheet.js');

describe('cue-parser', function () {
  test('single wav file', () => {
    const tracks = cuesheet.parse(path.join(__dirname, 'single-wav.cue'));

    const dest = [
      {
        album_title: "ALBUM TITLE",
        album_artist: "ALBUM PERFORMER",
        comment: "TRACK COMMENT 1",
        discid: "BBBBBBBB",
        date: "9999",
        genre: "AAAAAAAAA",
        discnumber: "2",
        totaldiscs: "6",
        tracktotal: 3,
        track_number: 1,
        track_artist: "TRACK PERFORMER 1",
        track_title: "TRACK TITLE 1",
        songwriter: "TRACK SONGWRITER 1",
        composer: "TRACK COMPOSER 1",
        conductor: "TRACK CONDUCTOR 1",
        isrc: "1111111111",
        file: "DDDDDDDDDDD.wav",
        indexes: { "1": "00:00:00.00", },
        start: "00:00:00.00",
        end: "00:04:16.60",
      },
      {
        album_title: "ALBUM TITLE",
        album_artist: "ALBUM PERFORMER",
        comment: "TRACK COMMENT 2",
        discid: "BBBBBBBB",
        date: "9999",
        genre: "AAAAAAAAA",
        discnumber: "2",
        totaldiscs: "6",
        tracktotal: 3,
        track_number: 2,
        track_artist: "TRACK PERFORMER 2",
        track_title: "TRACK TITLE 2",
        songwriter: "TRACK SONGWRITER 2",
        composer: "TRACK COMPOSER 2",
        conductor: "TRACK CONDUCTOR 2",
        isrc: "2222222222",
        file: "DDDDDDDDDDD.wav",
        indexes: { "0": "00:04:15.61", "1": "00:04:16.60", },
        start: "00:04:16.60",
        end: "00:09:56.00",
      },
      {
        album_title: "ALBUM TITLE",
        album_artist: "ALBUM PERFORMER",
        comment: "TRACK COMMENT 3",
        discid: "BBBBBBBB",
        date: "9999",
        genre: "AAAAAAAAA",
        discnumber: "2",
        totaldiscs: "6",
        tracktotal: 3,
        track_number: 3,
        track_artist: "TRACK PERFORMER 3",
        track_title: "TRACK TITLE 3",
        songwriter: "TRACK SONGWRITER 3",
        composer: "TRACK COMPOSER 3",
        conductor: "TRACK CONDUCTOR 3",
        isrc: "3333333333",
        file: "DDDDDDDDDDD.wav",
        indexes: { "1": "00:09:56.00", },
        start: "00:09:56.00",
        end: null,
      },
    ];

    expect(tracks).toEqual(dest);
  });

  test('multi wav file', () => {
    const tracks = cuesheet.parse(path.join(__dirname, 'multi-wav.cue'));

    const dest = [
      {
        album_title: "ALBUM TITLE",
        album_artist: "ALBUM PERFORMER",
        comment: "TRACK COMMENT 1",
        discid: "BBBBBBBB",
        date: "9999",
        genre: "AAAAAAAAA",
        discnumber: "2",
        totaldiscs: "6",
        tracktotal: 3,
        track_number: 1,
        track_artist: "TRACK PERFORMER 1",
        track_title: "TRACK TITLE 1",
        songwriter: "TRACK SONGWRITER 1",
        composer: "TRACK COMPOSER 1",
        conductor: "TRACK CONDUCTOR 1",
        isrc: "1111111111",
        file: "FILE1.wav",
        indexes: { "1": "00:01:02.03", },
        start: "00:01:02.03",
        end: null,
      },
      {
        album_title: "ALBUM TITLE",
        album_artist: "ALBUM PERFORMER",
        comment: "TRACK COMMENT 2",
        discid: "BBBBBBBB",
        date: "9999",
        genre: "AAAAAAAAA",
        discnumber: "2",
        totaldiscs: "6",
        tracktotal: 3,
        track_number: 2,
        track_artist: "TRACK PERFORMER 2",
        track_title: "TRACK TITLE 2",
        songwriter: "TRACK SONGWRITER 2",
        composer: "TRACK COMPOSER 2",
        conductor: "TRACK CONDUCTOR 2",
        isrc: "2222222222",
        file: "FILE2.wav",
        indexes: { "0": "00:04:05.06", "1": "00:07:08.09", },
        start: "00:07:08.09",
        end: null,
      },
      {
        album_title: "ALBUM TITLE",
        album_artist: "ALBUM PERFORMER",
        comment: "TRACK COMMENT 3",
        discid: "BBBBBBBB",
        date: "9999",
        genre: "AAAAAAAAA",
        discnumber: "2",
        totaldiscs: "6",
        tracktotal: 3,
        track_number: 3,
        track_artist: "TRACK PERFORMER 3",
        track_title: "TRACK TITLE 3",
        songwriter: "TRACK SONGWRITER 3",
        composer: "TRACK COMPOSER 3",
        conductor: "TRACK CONDUCTOR 3",
        isrc: "3333333333",
        file: "FILE3.wav",
        indexes: { "1": "00:10:11.12", },
        start: "00:10:11.12",
        end: null,
      },
    ];

    expect(tracks).toEqual(dest);
  });


  test('default values', () => {
    const tracks = cuesheet.parse(path.join(__dirname, 'default-values.cue'));

    const dest = [
      {
        album_title: 'unknown',
        album_artist: 'unknown',
        discnumber: "1",
        totaldiscs: "1",
        tracktotal: 2,
        track_number: 1,
        track_artist: 'unknown',
        track_title: 'unknown',
        songwriter: 'unknown',
        isrc: 'unknown',
        file: "DDDDDDDDDDD.wav",
        indexes: { "1": "00:00:00.00", },
        start: "00:00:00.00",
        end: "00:04:16.60",
      },
      {
        album_title: 'unknown',
        album_artist: 'unknown',
        discnumber: "1",
        totaldiscs: "1",
        tracktotal: 2,
        track_number: 2,
        track_artist: 'unknown',
        track_title: 'unknown',
        songwriter: 'unknown',
        isrc: 'unknown',
        file: "DDDDDDDDDDD.wav",
        indexes: { "1": "00:04:16.60", },
        start: "00:04:16.60",
        end: null,
      }
    ];

    expect(tracks).toEqual(dest);
  });
});

