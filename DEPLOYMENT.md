# Deployment

The application can be deployed to AWS as a static Nuxt site while the existing GitHub Pages deployment remains available during migration.

## Architecture

- S3 (`ap-northeast-1`): private static assets
- CloudFront: HTTPS distribution with Origin Access Control (OAC)
- AWS WAF (`us-east-1`): CloudFront Web ACL with a per-IP rate limit
- ACM (`us-east-1`, optional): certificate for a custom CloudFront domain
- Route 53 (optional): alias records to CloudFront
- GitHub Actions: OIDC -> IAM Role -> private S3

The S3 bucket has Block Public Access enabled. Public traffic reaches objects only through CloudFront OAC.

## 1. Install dependencies

```bash
corepack enable
pnpm install --no-frozen-lockfile
```

## 2. Configure AWS credentials

CDK needs AWS credentials so that `CDK_DEFAULT_ACCOUNT` is available and, when a custom domain is used, so Route 53 can be looked up.

For example, sign in with your normal AWS CLI/SSO profile before running CDK commands.

## 3. Bootstrap CDK

Both regions are required because CloudFront WAF and ACM resources live in `us-east-1`, while the S3 hosting stack is in `ap-northeast-1`.

```bash
pnpm exec cdk bootstrap aws://<AWS_ACCOUNT_ID>/us-east-1
pnpm exec cdk bootstrap aws://<AWS_ACCOUNT_ID>/ap-northeast-1
```

## 4. Review and deploy

Without a custom domain, CloudFront's generated domain name is enough to test the site.

```bash
pnpm cdk:synth
pnpm cdk:diff
pnpm cdk:deploy
```

The default bucket name is:

```text
japanese-russian-grade4-app-prod-<AWS_ACCOUNT_ID>
```

Override it when necessary:

```bash
pnpm exec cdk deploy --all -c bucketName=<UNIQUE_BUCKET_NAME>
```

The deploy outputs include:

- `BucketName`
- `CloudFrontDistributionId`
- `CloudFrontDomainName`
- `GitHubDeployRoleArn`

## 5. Configure GitHub Actions variables

In GitHub repository settings, add the following Actions **variables** (not secrets):

- `AWS_DEPLOY_ROLE_ARN`: value of the `GitHubDeployRoleArn` CDK output
- `AWS_BUCKET_NAME`: value of the `BucketName` CDK output

After these variables are set, `.github/workflows/deploy-aws.yml` deploys every push to `main`.

The workflow uses GitHub OIDC and does not require a long-lived AWS access key.

### OIDC subject

This repository was created after GitHub's immutable OIDC subject rollout. The IAM trust policy is intentionally limited to this repository's immutable owner/repository IDs and the `main` branch.

If a GitHub OIDC provider already exists in the AWS account, import it instead of creating another one:

```bash
pnpm exec cdk deploy --all \
  -c githubOidcProviderArn=arn:aws:iam::<AWS_ACCOUNT_ID>:oidc-provider/token.actions.githubusercontent.com
```

## Custom domain

Purchase/register the domain separately. Once a Route 53 Hosted Zone exists, pass the domain to CDK.

For an apex domain:

```bash
pnpm exec cdk deploy --all \
  -c domainName=example.jp \
  -c hostedZoneName=example.jp
```

For a subdomain:

```bash
pnpm exec cdk deploy --all \
  -c domainName=russian.example.jp \
  -c hostedZoneName=example.jp
```

CDK creates the ACM certificate in `us-east-1`, DNS validation records, and Route 53 A/AAAA aliases to CloudFront.

## Cache behavior

The AWS deployment builds Nuxt with `NUXT_APP_BASE_URL=/`.

GitHub Actions uploads:

- `_nuxt/*` with `Cache-Control: public,max-age=31536000,immutable`
- HTML, manifest, icons, and other non-hashed assets with `Cache-Control: no-cache`

The CloudFront cache policy respects these origin TTLs, so normal deployments do not require a full `/*` invalidation.

## WAF rate limit

The CloudFront Web ACL blocks an IP after 500 requests in the WAF rate-based evaluation window. Adjust the limit in `infra/lib/edge-stack.ts` after observing real traffic if necessary.

## GitHub Pages during migration

`.github/workflows/deploy-pages.yml` remains enabled for now. The Nuxt base URL defaults to `/russian-4kyu-training/` for GitHub Pages and is overridden to `/` only by the AWS deployment workflow.
