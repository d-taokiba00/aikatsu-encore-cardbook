# アイカツ！アンコール カード帳 v0.1

最小構成のカード所持管理版です。

## ファイル構成
- `index.html` カード帳本体
- `style.css` 見た目
- `app.js` ＋／−と保存処理
- `cards.json` 既存のカードマスター
- `images/` カード画像置き場

## 画像の置き方
カードIDをファイル名にしてください。

例：
- `images/E1-01.jpg`
- `images/E1-02.jpg`
- `images/E1-03.webp`

jpg / jpeg / png / webp の順に自動で探します。

## GitHub Pages
1. GitHubで新しいPublicまたはPrivateリポジトリを作成
2. このフォルダの中身をリポジトリ直下へアップロード
3. `Settings` → `Pages`
4. `Deploy from a branch` を選択
5. branch=`main` / folder=`/(root)` を選択して保存
6. 数分後に表示されたURLへアクセス

所持数はブラウザのlocalStorageに保存します。JSONやカードマスター自体は変更しません。
