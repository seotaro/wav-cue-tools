# WAV+cuesheet

## インストール

```bash
yarn install
```

## 実行

cuesheet を指定して変換

```bash
node convert.js cuesheet [output]
```

指定したフォルダーの cuesheet から変換

```bash
find {入力フォルダ} -iname \*.cue -type f | xargs -I "{}" node convert.js "{}" [output]                                 
```

以下のような階層構造で出力する。

{output}
├ {genre}
  ├ {album_artist}
    ├ {album}
      ├ {disc}-{track}.flac

## タグの対応

| cuesheet                | intermediate  | ffmpeg metadata |     |
| ----------------------- | ------------- | --------------- | --- |
| TITLE                   | album_title   | album           |     |
| PERFORMER               | album_artist  | album_artist    |     |
| PERFORMER               | track_artist  | artist          |     |
| CATALOG                 |               |                 |     |
| REM COMMENT             | comment       | comment         |     |
| REM DISCID              | discid        | discid          |     |
| REM DATE                | date          | date            |     |
| REM GENRE               | genre         | genre           |     |
| REM DISCNUMBER          | discnumber    | disc            |     |
| REM TOTALDISCS          | totaldiscs    | disctotal       |     |
| REM COMPOSER            | composer      | composer        |     |
| REM CONDUCTOR           |               |                 |     |
| SONGWRITER              | songwriter    | songwriter      |     |
| FILE filename WAVE      | （file）      |                 |     |
| FILE.TRACK n AUDIO      | track_number  | track           |     |
| FILE.TRACK.TITLE        | track_title   | title           |     |
| FILE.TRACK.REM COMPOSER | composer      | composer        |     |
| FILE.TRACK.ISRC         |               |                 |     |
| FILE.TRACK.PERFORMER    | track_artist: | artist          |     |
| FILE.TRACK.INDEX n      | indexes: {}   |                 |     |
|                         |               | tracktotal      |     |


