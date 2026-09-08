# 技術概要・データ設計

このページは、ロシア語4級トレーニングの現行アーキテクチャ、画面構成、問題データ、学習状態、音声、CI/CDの概要をまとめた技術ドキュメントです。

より詳細なAWS構成は [AWS_PUBLIC_HOSTING.md](AWS_PUBLIC_HOSTING.md)、本番デプロイ手順は [../DEPLOYMENT.md](../DEPLOYMENT.md)、SEO / OGPは [SEO.md](SEO.md) を参照してください。

## 使用技術

| 分類 | 技術 |
|---|---|
| フレームワーク | Nuxt 4 |
| UI | Vue 3 / Vue Router 5 |
| 言語 | TypeScript |
| CSS | Tailwind CSS 4、共通CSS |
| レンダリング | SSR有効 + `pnpm generate` による静的生成 / prerender |
| 本番配信 | Route 53 + CloudFront + private S3 |
| IaC | AWS CDK v2 / TypeScript |
| CI/CD | GitHub Actions + GitHub OIDC |
| 音声 | Web Speech API（SpeechSynthesis） |
| ブラウザ保存 | localStorage |
| PWA | Web App Manifest / Service Worker |
| テスト | Playwright smoke test |
| パッケージ管理 | pnpm |

バックエンドAPI、データベース、ログイン機能は使用していません。問題データと画面はビルド時に静的サイトへ組み込み、ユーザーごとの学習状態はブラウザ内に保存します。

## 公開・デプロイ構成

本番URLは次です。

```text
https://russian4kyu-training.com/
```

本番はNuxtで生成した静的ファイルをprivate S3へ配置し、CloudFront + OAC経由で配信します。Route 53でDNS、ACMでHTTPS証明書、AWS WAFでIP単位のレート制限を管理します。

GitHub Pages版も移行・フォールバック用として当面維持しています。

- AWS本番: `NUXT_APP_BASE_URL=/`
- GitHub Pages: `NUXT_APP_BASE_URL=/russian-4kyu-training/`

`nuxt.config.ts` ではSSRを有効にし、主要ルートをprerenderします。CloudFrontではclean URLをSSG済みのHTMLへrewriteするため、`/verbs` などへ直接アクセスしても静的HTMLを返せる構成です。

## GitHub Actions

`.github/workflows/` には主に次のworkflowがあります。

- `ci.yml`: PRのgenerate / CDK synth / Playwright smoke test
- `ci-performance.yml`: CI時間を集計し、README用SVGグラフを更新
- `deploy-aws.yml`: `main` push後のAWS本番デプロイ
- `deploy-pages.yml`: 移行期間中のGitHub Pagesデプロイ

### AWS本番デプロイ

`deploy-aws.yml` は必ず対象の `github.sha` をcheckoutし、先にChange Setベースの `cdk diff --all --fail` を実行します。

1. GitHub OIDCでproduction deploy roleをAssume
2. CDK diffをJob Summaryとartifactへ出力
3. CloudFormation差分なしならインフラdeployをskip
4. 差分ありならGitHub `production` EnvironmentでApproveを要求
5. Approve後にCDK deploy
6. Nuxtを `baseURL=/` でgenerate
7. `.output/public` をprivate S3へsync

CDK diff自体が失敗した場合はデプロイを停止し、インフラ差分として扱いません。production workflowは `aws-production` concurrency groupで直列化しています。

## 画面構成

主なルートは次のとおりです。

- `/`: トップ、各学習モードへの入口
- `/dashboard`: 学習ダッシュボード
- `/about`: このサイトについて
- `/feedback`: 機能要望・不具合報告
- `/reference`: 4級重要表現まとめ
- `/bonus`: おまけ
- `/prepositions`: 前置詞トレーニング
- `/cases`: 格変化トレーニング
- `/verbs`: 動詞トレーニング / 行く系動詞
- `/vocabulary`: 語彙トレーニング
- `/mixed`: 総合トレーニング
- `/reading`: 朗読対策
- `/sections/1`〜`/sections/8`: 大問別問題集
- `/translations/ru-ja`: 露文和訳
- `/translations/ja-ru`: 和文露訳
- `/mock`: 模擬試験

パンくずリストは共通コンポーネントでルートを正規化して表示します。

## 問題データ

問題データは `app/data/` のTypeScriptファイルで管理し、画面コンポーネントへ直接大量の問題を埋め込まない方針です。

主なデータは次のとおりです。

- `questions.ts` / `prepositionPoolV2.ts`: 前置詞
- `caseTraining.ts`: 格変化
- `verbTraining.ts`: 動詞
- `mixedTraining.ts`: 分野横断
- `section1.ts`〜`section8.ts`: 大問別
- `russianToJapanese.ts`: 露文和訳
- `japaneseToRussian.ts`: 和文露訳
- `readingPassages.ts`: 朗読
- `vocabulary.ts` / `vocabularyBulk.ts`: 語彙
- `vocabularyExamples*.ts`: 語彙例文
- `mockExam1.ts`〜`mockExam3.ts`: 模試3回分
- `mockExams.ts`: 模試一覧

語彙は現在579語で、単語、アクセント付き表記、日本語訳、品詞、名詞の性・単複・格変化、形容詞の変化、動詞の体・活用、例文などを型付きデータとして扱います。

## 大問別データ

### 第I問〜第IV問

発音、アクセント、名詞の性・代名詞、名詞の複数形を専用データとして管理します。学習表示では必要な語にアクセント記号を付けます。

### 第V問・格変化

名詞・形容詞・代名詞の格変化、格支配、性数一致を扱い、完成文、日本語訳、解説を表示します。

### 第VI問・疑問文への応答

疑問詞ごとの問題とNatural Responseを持ち、模範応答、日本語訳、疑問詞・選択肢の解説を表示します。

### 第VII問・人称変化

動詞の現在形を中心に扱います。学習モードでは完成文、日本語訳、活用・語義の解説を確認できます。模試では記述式で回答します。

### 第VIII問・過去形・未来形

主語の性・数に応じた過去形と未来表現を扱います。模試では過去形・未来形をそれぞれ入力して採点します。

## 分野別トレーニングの出題フロー

多くのトレーニングは問題プールから1セッション原則10問を作ります。

- 問題ごとの学習状態を利用
- 未学習・復習対象・学習中を優先
- 選択肢や問題順を必要に応じてシャッフル
- 回答後に結果をlocalStorageへ保存
- 学習状態は `未学習 / 復習 / 学習中 / 定着` の4段階で扱う

共通の進捗ロジックは `app/utils/questionProgress.ts` に置き、問題IDを保存キーとして利用します。既存IDは互換性のため不用意に変更しません。

## 模擬試験

現在は第1回〜第3回の3回分を収録しています。

- 文法I〜VIIIは自動採点
- 露文和訳・和文露訳は提出後に0〜100%で自己採点
- 試験中は正解・解説を表示しない
- 模試ごとに進捗、回答、残り時間を保存して再開可能
- 提出結果を保存し、後から「前回結果」を確認可能
- 自動採点で不正解の問題と、100%未満の翻訳問題を復習可能
- 復習での再回答は元の提出結果を上書きしない
- 再受験時は保存済み結果を消す前に確認する

模試を追加するときは個別データを `mockExams.ts` へ登録し、回ごとの状態が混ざらないよう模試ID単位で保存します。

## 学習ダッシュボード

ダッシュボードはlocalStorage上の学習履歴と模試結果を集計して表示します。

- 分野別の進捗・習熟度
- 復習対象件数
- 模試結果
- 学習状況のサマリー

サーバー集計は行わないため、別端末・別ブラウザとの同期はありません。

## 音声とアクセント

ロシア語の読み上げにはブラウザの `SpeechSynthesis` を使用します。

- 言語: `ru-RU`
- ロシア語ボイスが利用可能な場合は優先
- 初期速度: `0.4`
- 速度設定: `0.1`〜`1.0`
- 読み上げ速度はlocalStorageに保存
- 問題文、完成文、例文、重要表現など用途に応じて再生

アクセント記号は学習者向けの表示情報として保持します。`ё` は文字自体が強勢位置を示すため、追加のアキュートを付けない場合があります。

## PWAと保存仕様

PWAはWeb App ManifestとService Workerを利用します。ホーム画面からstandalone表示で起動でき、アプリ内リロードボタンも用意しています。

ユーザー固有の状態はlocalStorageへ保存します。

- 問題ごとの正誤・習熟度
- 模試の途中経過・提出結果・自己採点
- 読み上げ速度
- テーマ設定など

通常ブラウザとホーム画面追加したPWAでは、OS・ブラウザによって保存領域が分かれる場合があります。ブラウザデータを削除すると学習履歴も失われます。

## SEO / OGP

主要ページは静的生成時にprerenderし、検索エンジンやSNSクローラーがJavaScript実行前でも主要メタ情報を取得できるようにしています。

- title / description / canonical
- `robots.txt` / `sitemap.xml`
- WebSite / WebApplication JSON-LD
- Open Graph / Twitter Card
- 1200x630 OGP画像

詳細は [SEO.md](SEO.md) を参照してください。

## 変更時の注意

- 新しい問題には一意なIDを付け、既存IDは不用意に変更しない
- ロシア語の学習表示には必要なアクセントを付ける
- 模範文・例文には日本語訳を用意する
- 音声再生テキストと画面表示の内容を揃える
- 学習設定変更で回答中の問題セットを不意にリセットしない
- 模試の変更では回ごとのlocalStorage互換性を確認する
- `pnpm generate`、`pnpm cdk:synth`、Playwright smoke testを確認する
- AWS本番とGitHub PagesでbaseURLが異なることを意識する
