# ロシア語4級トレーニング

ロシア語能力検定4級の出題範囲・形式を意識して、苦手分野の反復練習から模擬試験までできるブラウザ学習アプリです。

一度ロシア語文法を学んだことがあり、4級対策として「問題を解きながら思い出したい・定着させたい」人を主な対象にしています。

**公開サイト: [https://russian4kyu-training.com/](https://russian4kyu-training.com/)**

> [!IMPORTANT]
> このサイトは個人制作の**非公式学習ツール**です。ロシア語能力検定試験の主催団体とは関係ありません。
>
> 掲載している問題・解説は独自に作成しており、**公式過去問そのものは収録していません**。出題範囲・問題形式・難易度を検討する際の参考として、実際の試験や過去問を参照しています。

## 公開サイト

- **本番**: https://russian4kyu-training.com/
- **GitHub Pages**: https://toshiakisan1127.github.io/russian-4kyu-training/ （移行・フォールバック用として当面維持）
- 本番は Route 53 + CloudFront + private S3 で配信しています。構成の詳細は [AWS公開構成](docs/AWS_PUBLIC_HOSTING.md)、デプロイ手順は [DEPLOYMENT.md](DEPLOYMENT.md) を参照してください。

## 主な機能

### 学習ダッシュボード

トップページとは別に、学習状況をまとめて確認できるダッシュボードがあります。

- 分野ごとの進捗・習熟度を表示
- 「未学習 / 復習 / 学習中 / 定着」の4段階で管理
- 模擬試験の結果を一覧化
- 復習対象の件数を確認

### 分野別トレーニング

苦手なテーマだけを選んで反復できます。

- **前置詞**: `в / на / из / с / к` など、場所・方向・格支配
- **格変化**: 生格・与格・対格・造格・前置格
- **動詞**: 現在形・過去形・未来形・完了体 / 不完了体
- **行く系動詞**: `идти́ / ходи́ть / е́хать / е́здить` の使い分けと活用
- **語彙**: 4級向け基本語彙579語から習熟度を考慮して出題
- **総合**: 前置詞・格変化・動詞・語彙を混ぜた演習

### 大問別問題集

4級の出題分野を大問単位で練習できます。

| 大問 | 内容 |
| --- | --- |
| I | 発音 |
| II | アクセント |
| III | 名詞の性・代名詞 |
| IV | 名詞の複数形 |
| V | 格変化 |
| VI | 疑問文への応答 |
| VII | 動詞の人称変化 |
| VIII | 過去形・未来形 |

記述式の問題では、選択式だけでなく実際に語形を入力する練習も取り入れています。

### 露文和訳・和文露訳

- 4級レベルの露文を日本語へ訳す練習
- 日本語文をロシア語へ訳す練習
- 模範訳・模範解答と比較して自己採点
- 和訳・露訳は模擬試験でも問題ごとに0〜100%で自己採点

### 模擬試験

現在、**3回分**のオリジナル模擬試験を収録しています。

- 過去問の出題形式を参考にした独自問題
- 試験中は解説を表示しない本番寄りの進行
- 文法問題は自動採点
- 露文和訳・和文露訳は自己採点
- 結果画面から間違えた問題・100%未満の翻訳問題を復習可能
- 模試結果はブラウザに保存され、あとから結果・復習画面を再確認可能

### 朗読対策

- アクセント付きのロシア語文章
- ブラウザの音声読み上げ
- 日本語訳
- 発音・読み方のポイント
- 読み上げ速度を0.1〜1.0で調整

### 4級重要表現まとめ

試験前に見返したい文法・重要表現を一覧で確認できます。

特に、`идти́ / ходи́ть / е́хать / е́здить` などの移動動詞は、現在形だけでなく過去形も含めてまとめています。

### PWA対応

スマートフォンではホーム画面へ追加して、アプリのように利用できます。

- ホーム画面から起動
- standalone表示
- アプリ内のリロードボタン
- ダークモード
- 読み上げ速度設定

### おまけ

試験勉強だけになりすぎないよう、ロシア語で遊ぶページも用意しています。

- ロシア国歌の歌詞
- 日本語訳
- アクセント付き歌詞
- 登場する単語のミニ単語集

## 学習データと保存仕様

問題データはTypeScriptで管理し、Nuxtの静的サイトとしてビルド時に組み込みます。

このアプリには現在、次のものはありません。

- ログイン
- サーバー側の学習履歴保存
- データベース
- ユーザーごとのクラウド同期

学習履歴、問題の習熟度、模擬試験結果、読み上げ速度、テーマ設定などはブラウザの `localStorage` に保存します。

そのため、**別端末・別ブラウザ間では進捗は同期されません**。また、端末やブラウザによっては通常のブラウザ表示とホーム画面に追加したPWAで保存領域が分かれる場合があります。

## 音声

ロシア語の読み上げにはブラウザの Web Speech API を使用します。

- 言語: `ru-RU`
- ロシア語音声が利用可能な場合はロシア語ボイスを使用
- 初期速度: `0.4`
- 速度設定: `0.1`〜`1.0`
- アクセント付きテキストを読み上げ用にも利用

利用できる音声や発音品質は、OS・端末・ブラウザによって異なります。

## フィードバック

機能要望や不具合報告を受け付けています。

- GitHubアカウントがある場合: Issueテンプレートから機能要望 / 不具合報告
- GitHubを使わない場合: X / Twitter の `@toshiakisan1127`

サイト内の「要望・不具合報告」ページから各窓口へ移動できます。

## 技術構成

### フロントエンド

- Nuxt 4
- Vue 3
- Vue Router 5
- Tailwind CSS 4
- TypeScript
- Web Speech API
- PWA / Service Worker

### SEO / OGP

検索エンジンやSNSクローラーがJavaScript実行前でもページ内容を取得できるよう、Nuxt SSGを前提に構成しています。

- `pnpm generate` による主要ページのprerender
- ページごとの title / description / canonical URL
- `robots.txt` / `sitemap.xml`
- `WebSite` / `WebApplication` のJSON-LD
- Open Graph / Twitter Card
- 1200x630のOGP画像
- CloudFront Functionで `/verbs` などのclean URLをSSG済みHTMLへrewrite

詳細は [SEO設計・運用メモ](docs/SEO.md) を参照してください。

### テスト

- Playwright

### CI Performance

PRのCI実行時間は、直近25回の成功runを対象に自動集計しています。

![CI performance chart](https://raw.githubusercontent.com/toshiakisan1127/russian-4kyu-training/ci-metrics/ci-performance.svg)

- **Total build job**: `build` job全体
- **Browser smoke tests**: Playwright smoke test
- **Playwright setup**: Chromium cache確認・system dependencies・Chromium本体の準備
- CI完了後、`ci-metrics` ブランチ上のSVGを自動更新

### AWS本番ホスティング

- Amazon Route 53: `russian4kyu-training.com` のDNS
- AWS Certificate Manager: HTTPS証明書
- Amazon CloudFront: HTTPS配信。Free pricing planを利用
- Amazon S3: 非公開の静的ファイル保存
- Origin Access Control (OAC): CloudFront経由のみS3へアクセス
- AWS WAF: IP単位 `500 requests / 300 sec` のレート制限
- CloudFront Function: clean URLをNuxt SSGの `index.html` へrewrite
- AWS CDK: インフラ管理
- GitHub Actions + OIDC: 長期AWSアクセスキーを置かずにデプロイ

`main` へのpush後は、確定したcommitに対して先に `cdk diff` を実行します。

- **CloudFormation差分なし**: 承認なしでNuxtをgenerateし、S3へ自動デプロイ
- **CloudFormation差分あり**: diffを確認し、GitHub `production` EnvironmentでApprove後にCDK deploy → S3 deploy
- diff自体が失敗した場合はデプロイを止め、インフラ差分として誤判定しない

GitHub Pages版も当面は並行して利用できる構成です。詳細は [DEPLOYMENT.md](DEPLOYMENT.md) を参照してください。

## 開発

### 必要環境

- Node.js 22以上
- pnpm 11

### セットアップ

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

### 主なコマンド

```bash
pnpm dev          # 開発サーバー
pnpm generate     # 静的サイト生成
pnpm build        # 本番ビルド
pnpm preview      # 生成物のプレビュー
pnpm test:smoke   # Playwright smoke test
pnpm cdk:synth    # CDKテンプレート生成
pnpm cdk:diff     # AWSとの差分確認
pnpm cdk:deploy   # AWSへデプロイ
```

## ディレクトリ構成

```text
.github/
  ISSUE_TEMPLATE/  機能要望・不具合報告テンプレート
  workflows/       CI / CI計測 / GitHub Pages / AWSデプロイ
app/
  components/      共通UI
  data/            問題・語彙・模試・読解データ
  pages/           各学習画面
  types/           型定義
  utils/           出題・進捗・アクセント処理など
infra/             AWS CDK
public/            PWA manifest / icon / Service Worker / SEO静的ファイル
scripts/           CI計測などの補助スクリプト
tests/             Playwrightテスト
docs/              技術・公開構成・SEOの補足資料
DEPLOYMENT.md       AWSデプロイ手順
nuxt.config.ts
```

## 関連ドキュメント

- [技術概要](docs/TECHNICAL_OVERVIEW.md)
- [AWS公開構成](docs/AWS_PUBLIC_HOSTING.md)
- [SEO設計・運用メモ](docs/SEO.md)
- [デプロイ手順](DEPLOYMENT.md)

## 利用・著作権について

このリポジトリは個人学習用に制作・公開しているプロジェクトです。

ロシア語能力検定試験の名称や出題範囲を学習対象の説明として参照していますが、公式教材・公式過去問を配布するものではありません。問題文・解説・模擬試験は独自に作成しています。

このリポジトリには現在、オープンソースライセンスを設定していません。
