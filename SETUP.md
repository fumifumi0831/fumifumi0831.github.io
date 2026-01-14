# GitHubリポジトリ作成手順

## 1. GitHubでリポジトリを作成

1. GitHubにログインして、[新しいリポジトリを作成](https://github.com/new)します
2. リポジトリ名を **`fumifumi0831.github.io`** に設定します（重要：この名前でないとGitHub Pagesが正しく動作しません）
3. リポジトリを **Public** に設定します
4. **「Initialize this repository with a README」のチェックを外します**（既にファイルがあるため）
5. 「Create repository」をクリックします

## 2. ローカルリポジトリをGitHubにプッシュ

GitHubでリポジトリを作成したら、以下のコマンドを実行します：

```bash
cd /Users/fumipen/Documents/progress/github_portfolio-site/portfolio-site

# リモートリポジトリを追加（GitHubで作成したリポジトリのURLを入力）
git remote add origin https://github.com/fumifumi0831/fumifumi0831.github.io.git

# メインブランチをプッシュ
git push -u origin main
```

## 3. GitHub Pagesの有効化

1. GitHubリポジトリのページで **Settings** タブをクリック
2. 左側のメニューから **Pages** を選択
3. **Source** セクションで：
   - Branch を **main** に選択
   - Folder を **/ (root)** に選択
4. **Save** をクリック

## 4. サイトの確認

数分待つと、以下のURLでサイトにアクセスできます：

**https://fumifumi0831.github.io**

## トラブルシューティング

### リモートリポジトリが既に存在する場合

```bash
git remote remove origin
git remote add origin https://github.com/fumifumi0831/fumifumi0831.github.io.git
git push -u origin main
```

### ブランチ名が異なる場合

```bash
git branch -M main
git push -u origin main
```

## 今後の更新方法

ファイルを変更したら、以下のコマンドで更新できます：

```bash
git add .
git commit -m "更新メッセージ"
git push
```

GitHub Pagesは自動的に更新されます（数分かかる場合があります）。
