# GitHub Pages ポートフォリオサイト

GitHubリポジトリの内容を自動的に読み取ってまとめてくれるポートフォリオサイトです。

## 機能

- **GitHub API連携**: GitHub REST APIを使用してリポジトリ情報を自動取得
- **リポジトリ分類**: フォーク/オリジナル、プライベート/パブリックで自動分類
- **フィルタリング**: タブでオリジナル/フォーク/すべてを切り替え可能
- **レスポンシブデザイン**: モバイル、タブレット、デスクトップに対応
- **キャッシュ機能**: ローカルストレージにキャッシュしてAPIリクエストを削減

## ファイル構成

```
portfolio-site/
├── index.html          # メインページ
├── css/
│   └── style.css       # スタイルシート
├── js/
│   ├── api.js          # GitHub API連携
│   ├── categorize.js   # リポジトリ分類ロジック
│   └── ui.js           # UI制御、フィルタリング
└── README.md           # このファイル
```

## セットアップ

### 1. GitHubリポジトリの作成

1. GitHubで `fumifumi0831.github.io` という名前のリポジトリを作成
2. このディレクトリの内容をリポジトリにアップロード

### 2. GitHub Pagesの有効化

1. リポジトリの Settings > Pages に移動
2. Source を "Deploy from a branch" に設定
3. Branch を "main" (または "master")、フォルダを "/ (root)" に設定
4. Save をクリック

### 3. カスタマイズ

`js/api.js` の `GITHUB_USERNAME` を変更することで、他のユーザーのリポジトリも表示可能です。

```javascript
const GITHUB_USERNAME = 'your-username';
```

## 使用方法

1. GitHub Pagesで公開後、`https://fumifumi0831.github.io` にアクセス
2. ページが自動的にGitHub APIからリポジトリ情報を取得
3. フィルタータブで「オリジナル」「フォーク」「すべて」を切り替え可能

## 技術スタック

- **HTML5**: セマンティックなマークアップ
- **CSS3**: モダンなスタイリング、CSS変数、アニメーション
- **JavaScript (ES6+)**: モダンなJavaScript機能を使用
- **GitHub REST API**: リポジトリ情報の取得

## デザインの特徴

frontend-designスキルの原則に従ったデザイン：

- **タイポグラフィ**: Space Grotesk（メイン）、JetBrains Mono（コード）
- **カラーパレット**: インディゴとピンクを基調としたグラデーション
- **アニメーション**: CSS-onlyアニメーション、3D効果
- **空間構成**: 非対称なグリッド、オーバーラップ効果
- **背景**: グラデーションメッシュ、ノイズテクスチャ

## ブラウザサポート

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)

## ライセンス

MIT License
