# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Animal Escape!** — スマホ向けスライドパズルゲーム。グリッド上に配置された動物をスライドさせてすべて脱出させるとクリア。Car Jam / Sheep Dash スタイル。

## Running the Game

ビルドツール不要。静的ファイルのみ。

```bash
# ローカル開発サーバー起動
python3 -m http.server 8080
# ブラウザで http://localhost:8080 を開く
```

または `index.html` をブラウザで直接開いても動作する。

## Architecture

### ファイル構成

```
index.html              # エントリーポイント。Phaser 3.60 をCDN(jsdelivr→unpkg fallback)で動的ロード
src/
  main.js               # Phaser.Game 設定 (400×700px, CANVAS モード)
  data/levels.js        # LEVELS[] 配列 — 20ステージのレベルデータ
  objects/Animal.js     # Animal クラス — ビジュアル・移動・矢印ボタン
  scenes/
    MenuScene.js        # レベル選択画面
    GameScene.js        # ゲーム本体
```

### スクリプトロード順

`index.html` が `levels.js → Animal.js → MenuScene.js → GameScene.js → main.js` の順に動的に `<script>` タグを連結ロードする。グローバル変数 (`LEVELS`, `Animal`, `MenuScene`, `GameScene`) で連携。

### Phaser 設定の要点

- `type: Phaser.CANVAS` — Safari 互換のため (`AUTO` 不可)
- `parent: 'game-container'` — `document.body` 直接指定は Safari で動作しない
- 解像度: 400×700px、`Scale.FIT` でスマホ画面にフィット

### グリッドとセルサイズ

レベルごとに `gridSize` (6/7/8) が異なる。`GameScene.create()` で動的計算:

```js
this.gridSize = levelData.gridSize || 6;
this.cellSize = Math.floor((W - 40) / this.gridSize);
this.gridOffsetX = Math.floor((W - this.gridSize * this.cellSize) / 2);
this.gridOffsetY = 108; // ヘッダー高さ 100px + マージン
```

### 衝突判定

`this.oGrid` (2D配列) で各セルの占有状況を管理。動物ID文字列 or `null`。`_maxSlide(animal, dir)` が移動可能ステップ数を計算し、グリッド外への脱出も検出する。

### 進捗保存

`localStorage['animalEscapeProgress']` に `{ [levelId]: stars }` のJSON。SafariでNaN対策が必要なため読み出し時は必ず `Math.min(3, Math.max(0, parseInt(v) || 0))` を使う。

### レベルデータ形式

```js
{
  id: 11, gridSize: 7, theme: '大草原', par: 8,
  animals: [
    { id: 'a', orientation: 'H', row: 0, col: 0, size: 2, animal: 'sheep' },
    // orientation: 'H'|'V', size: 2|3, animal: 8種のうちいずれか
  ]
}
```

`par` の最小値はステージの動物数と同じ（各動物を1手で脱出させた場合）。

### UIスタイル

8-bit レトロピクセルアート風:
- フォント: `"Press Start 2P"` (Google Fonts CDN)
- カラーパレット: 背景 `#0a0a1a`、グリッド枠 `#00ff88`、テキスト `#00ff88`/`#ffff00`
- CRT スキャンライン: 4px間隔の半透明横線 (depth=100)
- 角丸なし (`fillRect` のみ、`fillRoundedRect` は使わない)
- グリッドサイズ別バッジカラー: 6×6=`#ffff00`、7×7=`#0088ff`、8×8=`#ff6600`

## Safari 互換性の注意点

- `String.prototype.repeat(NaN)` は Safari で `RangeError` → 必ず整数チェックしてから呼ぶ
- Phaser は `Phaser.CANVAS` モード固定 (`AUTO` や `WEBGL` は不可)
- CDN フォールバック: jsdelivr 失敗時は unpkg を試みる (index.html の動的ロード処理)
