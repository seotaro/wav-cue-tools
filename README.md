# WAV+cuesheet

## インストール

```bash
yarn install
```

## 実行

cuesheet の内容をトラック単位に出力する。

```bash
Usage: node analyze.js cuesheet
```

指定した cuesheet を指定したフォーマットで出力する。

```bash
Usage: node convert.js cuesheet output [extent] [ffmpeg-options]
```

出力先には下記の階層構造で出力する。

```plaintext
{output}
├ {genre}
  ├ {album_artist}
    ├ {album}
      ├ {disc}-{track}.flac
```


例）flac で出力する。

```bash
node convert.js "oasis - (WHAT'S THE STORY) MORNING GLORY？.cue" 音楽フォルダー flac
```

例）mp3 で出力する。

```bash
node convert.js "oasis - (WHAT'S THE STORY) MORNING GLORY？.cue" 音楽フォルダー mp3 "-c:a libmp3lame -b:a 256k"
```

例）aac で出力する。

```bash
node convert.js "oasis - (WHAT'S THE STORY) MORNING GLORY？.cue" 音楽フォルダー mp4 "-c:a aac -b:a 256k"
```

例）HE-AAC で出力する。

```bash
node convert.js "oasis - (WHAT'S THE STORY) MORNING GLORY？.cue" 音楽フォルダー mp4 "-c:a libfdk_aac -profile:a aac_he_v2 -signaling implicit -vbr 3"
```

例）指定フォルダーの cuesheet から変換する。 ※ シングルクォート、ブラケットなどをパスに含まないこと。

```bash
find WAV音楽フォルダー -iname \*.cue -type f | xargs -I {} node convert.js {} 音楽フォルダー flac                              
```

## タグの対応

| ExactAudioCopy          | freac |               | デフォルト値       | ffmpeg metadata |
| ----------------------- | ----- | ------------- | ------------------ | --------------- |
| TITLE                   |       | album_title   |                    | album           |
| PERFORMER               |       | album_artist  |                    | album_artist    |
| PERFORMER               |       |               |                    | artist          |
| CATALOG                 |       |               |                    |                 |
| REM COMMENT             |       | comment       |                    | comment         |
| REM DISCID              |       | discid        |                    | discid          |
| REM DATE                |       | date          |                    | date            |
| REM GENRE               |       | genre         | "genre"            | genre           |
| REM DISCNUMBER          |       | discnumber    |                    | disc            |
| REM TOTALDISCS          |       | totaldiscs    | 1                  | disctotal       |
| REM COMPOSER            |       | composer      |                    | composer        |
| REM CONDUCTOR           |       |               |                    |                 |
| SONGWRITER              |       | songwriter    |                    | songwriter      |
| FILE filename WAVE      |       | （file）      |                    |                 |
| FILE.TRACK n AUDIO      |       | track_number  | 1                  | track           |
| FILE.TRACK.TITLE        |       | track_title   |                    | title           |
| FILE.TRACK.REM COMPOSER |       | composer      |                    | composer        |
| FILE.TRACK.ISRC         |       |               |                    |                 |
| FILE.TRACK.PERFORMER    |       | track_artist: | cuesheet.PERFORMER | artist          |
| FILE.TRACK.INDEX n      |       | indexes: {}   |                    |                 |
|                         |       |               |                    | tracktotal      |



## リッピングツールのタグ対応

| ExactAudioCopy v1.5     | freac v1.1.6           |
| ----------------------- | ---------------------- |
| REM GENRE               | REM GENRE              |
| REM DATE                | REM DATE               |
| REM DISCID              | -                      |
| REM COMMENT             | REM COMMENT            |
| PERFORMER               | PERFORMER              |
| TITLE                   | TITLE                  |
| REM COMPOSER            | -                      |
| FILE                    | FILE                   |
| FILE.TRACK.TITLE        | FILE.TRACK.TITLE       |
| FILE.TRACK.PERFORMER    | FILE.TRACK.PERFORMER   |
| FILE.TRACK.REM COMPOSER | -                      |
| FILE.TRACK.INDEX        | FILE.TRACK.INDEX       |
| -                       | FILE.TRACK.ISRC        |
| -                       | FILE.TRACK.REM COMMENT |


