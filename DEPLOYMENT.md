# Deployment

The application is deployed as a static Nuxt site on AWS while the existing GitHub Pages deployment remains available during migration.

Architecture details are documented in `docs/AWS_PUBLIC_HOSTING.md` and the project Wiki page **一般公開のためのコンポーネント構成図**.

## Architecture

- S3 (`ap-northeast-1`): CDK-managed private static assets
- CloudFront: HTTPS distribution with Origin Access Control (OAC)
- AWS WAF (`us-east-1`): CloudFront Web ACL with a per-IP rate limit
- ACM (`us-east-1`, optional): certificate for a custom CloudFront domain
- Route 53 (optional): alias records to CloudFront
- GitHub Actions: OIDC -> IAM deploy role -> CDK bootstrap roles / private S3

The S3 bucket is created by CDK with Block Public Access enabled. Public traffic reaches objects only through CloudFront OAC.

## Environments

The CDK app accepts `-c stage=dev|stg|prod`. The default is `prod`.

Default bucket names:

```text
russian4kyu-training-dev-<AWS_ACCOUNT_ID>
russian4kyu-training-stg-<AWS_ACCOUNT_ID>
russian4kyu-training-prod-<AWS_ACCOUNT_ID>
```

Lifecycle policy:

- `prod`: `RemovalPolicy.RETAIN`
- `dev` / `stg`: `RemovalPolicy.DESTROY` + `autoDeleteObjects`

This keeps production data protected while allowing disposable non-production stacks.

## 1. Install dependencies

```bash
corepack enable
pnpm install --frozen-lockfile
```

If local Corepack hits `ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING`, the temporary workaround is:

```bash
DISABLE_V8_COMPILE_CACHE=1 pnpm <command>
```

CI runs on Node.js 22.

## 2. Configure AWS credentials

Verify the active identity:

```bash
aws sts get-caller-identity
```

## 3. Bootstrap CDK

Both regions are required:

```bash
pnpm exec cdk bootstrap aws://<AWS_ACCOUNT_ID>/us-east-1
pnpm exec cdk bootstrap aws://<AWS_ACCOUNT_ID>/ap-northeast-1
```

The GitHub Actions deploy role does not receive CloudFormation, CloudFront, ACM, Route 53, or WAF permissions directly. It is allowed to assume only the CDK bootstrap deploy, lookup, and file-publishing roles for these two regions. CDK then uses the standard bootstrap execution role permissions during deployment.

## 4. Review and deploy manually

Local deploy remains useful for initial setup and non-production environments:

```bash
pnpm cdk:synth
pnpm cdk:diff
pnpm cdk:deploy
```

Because `prod` is the default stage, the commands above create:

- shared GitHub OIDC identity stack
- production WAF / optional ACM edge stack
- production S3 / CloudFront / IAM deploy role hosting stack

The edge stack (`us-east-1`) passes WAF/ACM values to the hosting stack (`ap-northeast-1`) through CDK cross-region references. On the **first** `cdk diff`, the accurate CloudFormation change-set diff for the hosting stack can report a missing `/cdk/exports/...` SSM parameter because the producer stack has not been deployed yet. CDK then falls back to a template diff. This does not mean the synthesized deployment is invalid; `cdk deploy --all` respects the stack dependency order and deploys the producer before the consumer.

For a template-only first diff without the change-set warning:

```bash
pnpm exec cdk diff --method=template
```

To deploy another stage:

```bash
pnpm exec cdk deploy --all -c stage=dev
```

The deploy outputs include:

- `BucketName`
- `CloudFrontDistributionId`
- `CloudFrontDomainName`
- `GitHubDeployRoleArn`

## 5. Configure GitHub Actions variables

In GitHub repository settings, add these Actions **variables**:

- `AWS_DEPLOY_ROLE_ARN`: production `GitHubDeployRoleArn`
- `AWS_BUCKET_NAME`: production `BucketName`

GitHub Actions uses OIDC; no long-lived AWS Access Key / Secret Access Key is stored.

### One-time migration for automated CDK deploy

The existing production GitHub deploy role originally had S3 permissions only. Before the first workflow run that includes CDK deployment, update that role once from a trusted local AWS session using the commit that contains the bootstrap-role policy:

```bash
pnpm exec cdk deploy Russian4KyuHostingStack-prod \
  --require-approval never \
  -c stage=prod \
  -c domainName=russian4kyu-training.com \
  -c hostedZoneName=russian4kyu-training.com
```

This is the final required local production infrastructure deploy for the migration. After it succeeds, future production infrastructure changes are applied from GitHub Actions after they are merged to `main`.

### Production workflow

`.github/workflows/deploy-aws.yml` runs on each push to `main` and can also be started manually with `workflow_dispatch`.

It:

1. checks out the exact triggering `github.sha`
2. installs dependencies and generates the static site
3. assumes the GitHub OIDC deploy role
4. deploys `Russian4KyuHostingStack-prod`; CDK includes its required dependency stacks
5. uploads the generated static files to S3

The production workflow keeps a single `aws-production` concurrency group, so overlapping production deployments are cancelled rather than running concurrently. CDK deploy runs before the S3 sync; if infrastructure deployment fails, application assets are not partially promoted afterward.

The production CDK command always supplies the custom-domain context:

```text
stage=prod
domainName=russian4kyu-training.com
hostedZoneName=russian4kyu-training.com
```

This prevents an automated deploy from accidentally synthesizing production without the existing ACM / Route 53 configuration.

### Shared OIDC provider

`Russian4KyuIdentityStack` owns the GitHub OIDC provider once per AWS account. Stage-specific hosting stacks reuse it.

If an OIDC provider already exists outside this CDK app, import it:

```bash
pnpm exec cdk deploy --all \
  -c githubOidcProviderArn=arn:aws:iam::<AWS_ACCOUNT_ID>:oidc-provider/token.actions.githubusercontent.com
```

## Custom domain

Production domain:

```text
russian4kyu-training.com
```

The domain is registered in Route 53. After the public Hosted Zone exists, attach it to CloudFront with:

```bash
pnpm exec cdk deploy --all \
  -c stage=prod \
  -c domainName=russian4kyu-training.com \
  -c hostedZoneName=russian4kyu-training.com
```

CDK creates the ACM certificate in `us-east-1`, DNS validation, and Route 53 A/AAAA aliases to CloudFront.

## Cache behavior

AWS builds Nuxt with `NUXT_APP_BASE_URL=/`.

GitHub Actions uploads:

- `_nuxt/*`: `Cache-Control: public,max-age=31536000,immutable`
- HTML / manifest / icons / other non-hashed assets: `Cache-Control: no-cache`

## WAF rate limit

The CloudFront Web ACL blocks an IP after more than 500 requests in a 300-second evaluation window.

## GitHub Pages during migration

`.github/workflows/deploy-pages.yml` remains enabled during migration.

- GitHub Pages build: `/russian-4kyu-training/`
- AWS build: `/`

After AWS production is verified, the GitHub Pages workflow can be removed.
