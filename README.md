# my-tetris

Drop in and clear lines with a smooth Svelte-powered Tetris that begs for “just one more game.” / Svelte製のスムーズなテトリスで「もう一回だけ」と遊び続けたくなる。

## Description / 説明
- EN: A keyboard-first, neon-styled Tetris remake built with Svelte + Vite, keeping the core logic clean and testable.
- JP: キーボード操作を重視したネオン調テトリス。Svelte + Viteで構築し、ゲームロジックはシンプルかつテストしやすく整理。

## Features / 特徴
- Responsive board with glowing overlays for level-up and Tetris moments / レベルアップやテトリス時のグロー演出付きレスポンシブ盤面。
- Keyboard-first controls plus on-screen ControlPad for touch / キーボード操作に加え、タッチ用コントロールパッドを用意。
- Next piece canvas + queue rendered in the side panel / サイドパネルに次ピース表示とキューを描画。
- Selectable sound patterns, master volume, mute, and quick test buttons / サウンドパターン選択、マスターボリューム、ミュート、テストボタンを実装。
- Simple ranking modal with name entry after Game Over (stub UI) / ゲームオーバー後に名前を入れる簡易ランキングモーダル（UIスタブ）。

## Controls / 操作
- Keyboard: Arrow keys = move/soft drop, Space = hard drop, Q or ArrowUp = rotate. Space on the menu starts a run. / キーボード: 矢印で移動・ソフトドロップ、Spaceでハードドロップ、Qまたは上矢印で回転。メニューでSpaceを押すと開始。
- Touch: Use the on-screen ControlPad for move/rotate/drop. / タッチ操作: 画面上のコントロールパッドで移動・回転・ドロップ。

## Run locally / ローカル実行
```bash
npm install
npm run dev -- --open   # start dev server
npm run build           # production build to dist/
npm run preview         # serve built assets
npm run lint            # ESLint for JS/Svelte
npm run format          # Prettier write
```

## Project layout / 構成
- `src/main.js`: Boots `src/App.svelte`.
- `src/App.svelte`: Game shell, keyboard handling, audio, and UI orchestration.
- `src/logic.js`: Framework-agnostic game logic helpers.
- `src/components/`: Game board, UI overlays, settings/ranking/debug modals, control pad, and side panel.
