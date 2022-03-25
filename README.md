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


