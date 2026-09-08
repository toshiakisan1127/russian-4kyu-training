# SEO 設計・運用メモ

このドキュメントは `russian4kyu-training.com` のSEO構成、実装方針、本番確認方法、運用上の注意点をまとめたものです。

## 目的

このサイトはロシア語能力検定4級の学習用Webアプリで、検索エンジンから各トレーニングページへ直接到達できる状態を目指しています。

SPAとしてトップページだけを返す構成ではなく、検索クローラーがJavaScriptを実行しなくても各URL固有のHTML・title・descriptionを取得できることを重視しています。

## 現在の構成

### 1. Nuxt SSG / prerender

`nuxt.config.ts` では `ssr: true` を有効にし、公開ページを `nitro.prerender.routes` で静的生成しています。

本番ビルドは `pnpm generate` を使用し、例えば以下のようなHTMLが生成されます。

```text
.output/public/index.html
.output/public/verbs/index.html
.output/public/cases/index.html
.output/public/vocabulary/index.html
...
```

`crawlLinks: true` も有効にしており、明示したルートに加えてリンク先もprerender対象として探索します。

新しい公開ページを追加した場合は、必要に応じて `prerenderRoutes` と `public/sitemap.xml` に追加します。

## 2. ページごとのSEOメタ情報

`app/composables/usePageSeo.ts` にパスごとの以下の情報を定義しています。

- `title`
- `description`
- `robots`
- canonical URL

主な公開ページは個別のtitle / descriptionを持ちます。

例:

```text
/verbs
ロシア語4級 動詞活用トレーニング｜現在形・過去形・未来形・移動動詞
```

canonical URLは `runtimeConfig.public.siteUrl` と現在のroute pathから生成し、常に `https://russian4kyu-training.com/...` を指すようにしています。

### noindexページ

個人の学習状況や検索流入の必要がない以下のページは `noindex, follow` にしています。

- `/dashboard`
- `/feedback`

公開ページを追加するときは、検索結果に出す価値があるページかを判断して `noindex` を設定します。

## 3. robots.txt / sitemap.xml

### robots.txt

`public/robots.txt`

```text
User-agent: *
Allow: /

Sitemap: https://russian4kyu-training.com/sitemap.xml
```

### sitemap.xml

`public/sitemap.xml` に検索対象とする主要ページを列挙しています。

`dashboard` や `feedback` のようなnoindexページはsitemapには含めません。

ページ追加時は `prerenderRoutes` とsitemapの両方を確認します。

## 4. 構造化データ

`nuxt.config.ts` でJSON-LDを出力しています。

現在は以下を定義しています。

- `WebSite`
- `WebApplication`
- `applicationCategory: EducationalApplication`
- `isAccessibleForFree: true`

サイト全体の説明とWeb学習アプリであることを検索エンジンに伝える目的です。

## 5. CloudFrontでclean URLをSSG HTMLへ変換

S3はprivate bucket + CloudFront OAC構成です。

Nuxt SSGは `/verbs/index.html` を生成しますが、CloudFrontからS3へ `/verbs` をそのまま送るとS3 key `verbs` を探してしまいます。

そこで `infra/lib/hosting-stack.ts` のCloudFront Functionを `viewer-request` に設定し、拡張子のないURLを静的HTMLへ変換しています。

```text
/       -> /index.html
/verbs  -> /verbs/index.html
/cases  -> /cases/index.html
```

`.js`, `.css`, `.png`, `robots.txt`, `sitemap.xml` など、末尾セグメントに拡張子があるリクエストはそのまま通します。

このrewriteがない場合、403/404のerror responseでトップページの `index.html` を返すだけになり、URLごとのSEO HTMLを検索クローラーへ返せません。

## 6. 本番確認

CDK deploy後は、主要なclean URLが200で返ることを確認します。

```bash
curl -I https://russian4kyu-training.com/verbs
curl -I https://russian4kyu-training.com/cases
```

期待値:

```text
HTTP/2 200
content-type: text/html
```

さらに異なるページで `content-length` やHTML本文が異なることを確認すると、トップページfallbackではなく各ページ固有のSSG HTMLが返っていることを確認できます。

必要に応じて以下でも確認します。

```bash
curl -s https://russian4kyu-training.com/verbs | grep -E '<title>|canonical|description'
```

## 7. CloudFront Free pricing planの注意点

CloudFrontはFree pricing planを使用しています。

Free pricing planのDistribution更新時に `PriceClass` を送るとCloudFront APIで拒否されます。

AWS CDK L2 `Distribution` はPriceClassをデフォルト出力するため、`infra/lib/hosting-stack.ts` ではL1 resourceに対して以下を設定し、CloudFormation templateから `PriceClass` 自体を削除しています。

```ts
const cfnDistribution = distribution.node.defaultChild as cloudfront.CfnDistribution
cfnDistribution.addPropertyDeletionOverride('DistributionConfig.PriceClass')
```

`PriceClass = None` のように値を設定するのではなく、プロパティそのものを送信しないことが重要です。

## 8. CDK deploy時のcontext

独自ドメインとACM証明書はCDK contextを使って構成します。

手動でdeploy / diffする場合は必ず本番domain contextを付けます。

```bash
pnpm exec cdk diff Russian4KyuHostingStack-prod \
  -c accountId=<AWS_ACCOUNT_ID> \
  -c domainName=russian4kyu-training.com \
  -c hostedZoneName=russian4kyu-training.com
```

```bash
pnpm exec cdk deploy Russian4KyuHostingStack-prod \
  -c accountId=<AWS_ACCOUNT_ID> \
  -c domainName=russian4kyu-training.com \
  -c hostedZoneName=russian4kyu-training.com
```

`domainName` を付けずに本番stackをdeployすると、CDK上で独自ドメイン/証明書なしのdesired stateになり、ACM証明書の削除など意図しない変更が発生する可能性があります。

本番CDK deployは将来的にGitHub Actionsへ統合し、mainの確定commitからのみ実行する方針です（Issue #188）。

## 9. ページ追加時のSEOチェックリスト

新しい検索対象ページを追加したときは以下を確認します。

1. `usePageSeo.ts` に個別title / descriptionを追加
2. `prerenderRoutes` に追加（必要な場合）
3. `public/sitemap.xml` に追加
4. canonical URLが正しいことを確認
5. `pnpm generate` 後に対象の `index.html` が生成されることを確認
6. 本番でclean URLがHTTP 200になることを確認
7. 検索対象にしないページなら `noindex` を設定しsitemapから除外

## 10. OGP / SNS共有

SEOとは別に、SNSやチャットへURLを貼ったときの表示はOpen Graph / Twitter Cardで対応します。

OGP対応はIssue #183で管理しています。

予定している内容:

- `og:title`
- `og:description`
- `og:url`
- `og:image`（1200x630）
- `og:type`
- `og:site_name`
- Twitter `summary_large_image`

SSG済みHTMLにOGP metaを含め、SNSクローラーがJavaScriptなしで取得できる構成にします。

## 関連ファイル

- `nuxt.config.ts`
- `app/composables/usePageSeo.ts`
- `public/robots.txt`
- `public/sitemap.xml`
- `infra/lib/hosting-stack.ts`
- `.github/workflows/deploy-aws.yml`
- `DEPLOYMENT.md`
- `docs/AWS_PUBLIC_HOSTING.md`

## 関連Issue / PR

- SEO基本対応: Issue #182 / PR #185
- OGP対応: Issue #183
- CI高速化: Issue #187
- CDK本番deployのGitHub Actions統合: Issue #188
- CloudFront Free pricing plan対応: PR #191, PR #192
