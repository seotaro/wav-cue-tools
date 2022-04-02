# wav+cue

wav ファイル + cue シート（以下、wav+cue とする）で構成されたオーディオファイルから任意のオーディオフォーマットに変換する。cue シートで定義する wav は単一または複数。変換時にタグ情報を付加する。

## 動機

Windows 環境で CD-DA からリッピングして再生するなら wav+cue 形式は使い勝手が良く、かれこれ 2000年 ぐらいから全てこの形式で管理している。であるが、Windows 以外で再生しようとすると（例えば、ラズパイでメディアサーバーを立ち上げる、とか）、とたんに具合が悪いことになってしまう。cue シートに対応してなくてただのタグ情報のないオーディオファイルになってしまうのだ。

そこでオリジナルは wav+cue 形式として、必要に応じてフォーマットを変換することにした。

## インストール

```bash
yarn install
```

## 実行

cue シートの内容をトラック順に表示する。

```bash
node analyze.js cuesheet
```

cue シートを指定したフォーマットで出力する。

```bash
node convert.js cuesheet output [extent] [ffmpeg-options]
```

出力は下記の階層構造・名称とする。
パスが長くなりすぎるのを避けるため、トラックのファイル名称は必要最低限とした。

```plaintext
{output}
├ {genre}
  ├ {album_artist}
    ├ {album}
      ├ {disc}-{track}.flac
```

## 実行例

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

例）指定フォルダーの cue シートから変換する。 ※ シングルクォート、ブラケットなどをパスに含まないこと。

```bash
find WAV音楽フォルダー -iname \*.cue -type f | xargs -I {} node convert.js {} 音楽フォルダー flac                              
```

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
