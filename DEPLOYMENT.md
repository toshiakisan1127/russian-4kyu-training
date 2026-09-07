# Deployment

The application can be deployed to AWS as a static Nuxt site while the existing GitHub Pages deployment remains available during migration.

Architecture details are documented in `docs/AWS_PUBLIC_HOSTING.md` and mirrored to the project Wiki page **一般公開のためのコンポーネント構成図**.

## Architecture

- Existing private S3 bucket (`ap-northeast-1`): static assets
- CloudFront: HTTPS distribution with Origin Access Control (OAC)
- AWS WAF (`us-east-1`): CloudFront Web ACL with a per-IP rate limit
- ACM (`us-east-1`, optional): certificate for a custom CloudFront domain
- Route 53 (optional): alias records to CloudFront
- GitHub Actions: OIDC -> IAM Role -> private S3

The S3 bucket stays private. Public traffic reaches objects only through CloudFront OAC.

## 1. Prepare the private S3 bucket

The production bucket is created once outside CDK and then imported by name. The current default is:

```text
russian4kyu-training-prod-<AWS_ACCOUNT_ID>
```

For account `470529257240` this resolves to:

```text
russian4kyu-training-prod-470529257240
```

Block Public Access must remain enabled for the bucket. CDK manages the bucket policy that allows object reads only from the created CloudFront distribution and denies insecure transport.

To use a different existing bucket, pass:

```bash
-c bucketName=<EXISTING_PRIVATE_BUCKET_NAME>
```

## 2. Install dependencies

```bash
corepack enable
pnpm install --no-frozen-lockfile
```

If the local Corepack installation hits `ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING`, the temporary workaround used during setup is:

```bash
DISABLE_V8_COMPILE_CACHE=1 pnpm <command>
```

CI runs on Node.js 22.

## 3. Configure AWS credentials

CDK needs AWS credentials so that `CDK_DEFAULT_ACCOUNT` is available and, when a custom domain is used, so Route 53 can be looked up.

Verify the active identity first:

```bash
aws sts get-caller-identity
```

## 4. Bootstrap CDK

Both regions are required because CloudFront WAF and ACM resources live in `us-east-1`, while the hosting stack is deployed from `ap-northeast-1`.

```bash
pnpm exec cdk bootstrap aws://<AWS_ACCOUNT_ID>/us-east-1
pnpm exec cdk bootstrap aws://<AWS_ACCOUNT_ID>/ap-northeast-1
```

Bootstrap is a one-time environment setup. It creates the CDK toolkit resources that CloudFormation/CDK uses during deployments.

## 5. Review and deploy

Without a custom domain, CloudFront's generated domain name is enough to test the site.

```bash
pnpm cdk:synth
pnpm cdk:diff
pnpm cdk:deploy
```

The deploy outputs include:

- `BucketName`
- `CloudFrontDistributionId`
- `CloudFrontDomainName`
- `GitHubDeployRoleArn`

## 6. Configure GitHub Actions variables

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

Purchase/register the domain separately. The planned production domain is `russian4kyu-training.jp`. Once a Route 53 Hosted Zone exists, pass the domain to CDK.

```bash
pnpm exec cdk deploy --all \
  -c domainName=russian4kyu-training.jp \
  -c hostedZoneName=russian4kyu-training.jp
```

CDK creates the ACM certificate in `us-east-1`, DNS validation records, and Route 53 A/AAAA aliases to CloudFront.

## Cache behavior

The AWS deployment builds Nuxt with `NUXT_APP_BASE_URL=/`.

GitHub Actions uploads:

- `_nuxt/*` with `Cache-Control: public,max-age=31536000,immutable`
- HTML, manifest, icons, and other non-hashed assets with `Cache-Control: no-cache`

The CloudFront cache policy respects these origin TTLs, so normal deployments do not require a full `/*` invalidation.

## WAF rate limit

The CloudFront Web ACL blocks an IP after more than 500 requests in a 300-second evaluation window. The threshold is intentionally simple for the initial static-site release and can be tuned from CloudWatch/WAF sampled requests later.

## GitHub Pages during migration

`.github/workflows/deploy-pages.yml` remains enabled for now. The Nuxt base URL defaults to `/russian-4kyu-training/` for GitHub Pages and is overridden to `/` only by the AWS deployment workflow.
