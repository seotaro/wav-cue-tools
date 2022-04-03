# wav+cue tools

wav ファイル + cue シート（以下、wav+cue とする）で構成されたオーディオファイルから任意のオーディオフォーマットに変換する。cue シートで定義する wav は単一または複数とする。変換時にタグ情報を付加し、画像ファイルがあればコピーする。

## 動機

Windows 環境で CD-DA からリッピングして再生するなら wav+cue 形式は使い勝手が良く、かれこれ 2000年 ぐらいから全てこの形式で管理している。であるが、Windows 以外で扱おうとすると（例えば、ラズパイでメディアサーバーを立ち上げる、とか）、とたんに具合が悪いことになってしまう。cue シートに対応してないので、ただのタグ情報のないオーディオファイルになってしまうのだ。

そこでオリジナルは wav+cue 形式で保存しつつ、必要に応じてフォーマットを変換することにした。

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

## タギング

### リッピングツールが生成する cue コマンド

| cue コマンド            | ExactAudioCopy v1.5 | fre:ac v1.1.6（macOS） |
| ----------------------- | ------------------- | ---------------------- |
| REM GENRE               | ✓                   | ✓                      |
| REM DATE                | ✓                   | ✓                      |
| REM DISCID              | ✓                   | -                      |
| REM DISCNUMBER ※        | -                   | -                      |
| REM TOTALDISCS ※        | -                   | -                      |
| REM COMMENT             | ✓                   | ✓                      |
| REM COMPOSER            | ✓                   | -                      |
| REM CONDUCTOR ※         | -                   | -                      |
| SONGWRITER ※            | -                   | -                      |
| PERFORMER               | ✓                   | ✓                      |
| TITLE                   | ✓                   | ✓                      |
| REM COMPOSER            | ✓                   | -                      |
| TRACK / TITLE           | ✓                   | ✓                      |
| TRACK / PERFORMER       | ✓                   | ✓                      |
| TRACK / REM COMPOSER    | ✓                   | -                      |
| TRACK / REM CONDUCTOR ※ | -                   | -                      |
| TRACK / SONGWRITER ※    | -                   | -                      |
| TRACK / ISRC            | -                   | ✓                      |
| TRACK / REM COMMENT     | -                   | ✓                      |

※ cue シートファイルを編集して追加する。

### cue コマンドとタグのマッピング

| cue コマンド          | タグ                      | デフォルト |
| --------------------- | ------------------------- | ---------- |
| REM GENRE             | genre                     | 'genre'    |
| REM DATE              | date                      |            |
| REM DISCID            | discid                    |            |
| REM DISCNUMBER        | discnumber                | 1          |
| REM TOTALDISCS        | totaldiscs                | 1          |
| REM COMMENT           | comment                   |            |
| REM CONDUCTOR         | conductor                 |            |
| SONGWRITER            | songwriter                |            |
| PERFORMER             | album_artist,track_artist |            |
| TITLE                 | album_title               |            |
| REM COMPOSER          | composer                  |            |
| TRACK / TITLE         | track_title               |            |
| TRACK / PERFORMER     | track_artist ※            |            |
| TRACK / REM COMPOSER  | composer ※                |            |
| TRACK / REM CONDUCTOR | conductor ※               |            |
| TRACK / SONGWRITER    | songwriter ※              |            |
| TRACK / ISRC          |                           |            |
| TRACK / REM COMMENT   | comment ※                 |            |

※ トラックの方が優先、上書きする

### タグと ffmpeg metadata のマッピング

| タグ         | ffmpeg metadata |
| ------------ | --------------- |
| album_title  | album           |
| album_artist | album_artist    |
| track_artist | artist          |
| comment      | comment         |
| date         | date            |
| discid       | discid          |
| discnumber   | disc            |
| genre        | genre           |
| songwriter   | songwriter      |
| track_title  | title           |
| totaldiscs   | disctotal       |
| composer     | composer        |
| tracktotal ※ | tracktotal      |
| track_number | track           |

※ プログラム内で生成する

## 参考

1. [Cue sheet](https://wiki.hydrogenaud.io/index.php?title=Cue_sheet)  *Hydrogenaudio Knowledgebase*
1. [Ogg Vorbis I format specification: comment field and header specification](https://xiph.org/vorbis/doc/v-comment.html) *Ogg Vorbis Documentation*
