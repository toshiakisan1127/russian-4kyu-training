import {
  Aws,
  CfnOutput,
  Duration,
  RemovalPolicy,
  Stack,
  type StackProps,
  aws_certificatemanager as acm,
  aws_cloudfront as cloudfront,
  aws_cloudfront_origins as origins,
  aws_iam as iam,
  aws_route53 as route53,
  aws_route53_targets as route53Targets,
  aws_s3 as s3,
} from 'aws-cdk-lib'
import type { Construct } from 'constructs'

interface HostingStackProps extends StackProps {
  webAclArn: string
  certificate?: acm.ICertificate
  domainName?: string
  hostedZoneName?: string
  bucketName?: string
  githubOidcProviderArn?: string
}

const GITHUB_OWNER = 'toshiakisan1127'
const GITHUB_OWNER_ID = '48203235'
const GITHUB_REPOSITORY = 'russian-4kyu-training'
const GITHUB_REPOSITORY_ID = '1355052125'
const GITHUB_BRANCH = 'main'
const DEPLOY_ROLE_NAME = 'github-actions-russian-4kyu-deploy'

export class HostingStack extends Stack {
  constructor(scope: Construct, id: string, props: HostingStackProps) {
    super(scope, id, props)

    if (props.domainName && !props.certificate) {
      throw new Error('certificate is required when domainName is configured')
    }

    const bucket = new s3.Bucket(this, 'AppBucket', {
      bucketName: props.bucketName ?? `japanese-russian-grade4-app-prod-${Aws.ACCOUNT_ID}`,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
      removalPolicy: RemovalPolicy.RETAIN,
    })

    const cachePolicy = new cloudfront.CachePolicy(this, 'CachePolicy', {
      minTtl: Duration.seconds(0),
      defaultTtl: Duration.seconds(0),
      maxTtl: Duration.days(365),
      cookieBehavior: cloudfront.CacheCookieBehavior.none(),
      headerBehavior: cloudfront.CacheHeaderBehavior.none(),
      queryStringBehavior: cloudfront.CacheQueryStringBehavior.none(),
      enableAcceptEncodingBrotli: true,
      enableAcceptEncodingGzip: true,
    })

    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultRootObject: 'index.html',
      webAclId: props.webAclArn,
      priceClass: cloudfront.PriceClass.PRICE_CLASS_200,
      certificate: props.certificate,
      domainNames: props.domainName ? [props.domainName] : undefined,
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(bucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
        compress: true,
        cachePolicy,
        responseHeadersPolicy: cloudfront.ResponseHeadersPolicy.SECURITY_HEADERS,
      },
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: Duration.seconds(0),
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: Duration.seconds(0),
        },
      ],
    })

    if (props.domainName) {
      if (!props.hostedZoneName) {
        throw new Error('hostedZoneName is required when domainName is configured')
      }

      const zone = route53.HostedZone.fromLookup(this, 'HostedZone', {
        domainName: props.hostedZoneName,
      })

      const recordName = toRecordName(props.domainName, props.hostedZoneName)

      new route53.ARecord(this, 'AliasARecord', {
        zone,
        recordName,
        target: route53.RecordTarget.fromAlias(new route53Targets.CloudFrontTarget(distribution)),
      })

      new route53.AaaaRecord(this, 'AliasAaaaRecord', {
        zone,
        recordName,
        target: route53.RecordTarget.fromAlias(new route53Targets.CloudFrontTarget(distribution)),
      })
    }

    const oidcProvider = props.githubOidcProviderArn
      ? iam.OpenIdConnectProvider.fromOpenIdConnectProviderArn(
          this,
          'GitHubOidcProvider',
          props.githubOidcProviderArn,
        )
      : new iam.OpenIdConnectProvider(this, 'GitHubOidcProvider', {
          url: 'https://token.actions.githubusercontent.com',
          clientIds: ['sts.amazonaws.com'],
        })

    const immutableSubject =
      `repo:${GITHUB_OWNER}@${GITHUB_OWNER_ID}/${GITHUB_REPOSITORY}@${GITHUB_REPOSITORY_ID}` +
      `:ref:refs/heads/${GITHUB_BRANCH}`

    const deployRole = new iam.Role(this, 'GitHubDeployRole', {
      roleName: DEPLOY_ROLE_NAME,
      assumedBy: new iam.WebIdentityPrincipal(oidcProvider.openIdConnectProviderArn, {
        StringEquals: {
          'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
          'token.actions.githubusercontent.com:sub': immutableSubject,
        },
      }),
      description: 'Deploy russian-4kyu-training static assets from GitHub Actions to S3',
    })

    bucket.grantReadWrite(deployRole)

    new CfnOutput(this, 'BucketName', {
      value: bucket.bucketName,
    })
    new CfnOutput(this, 'CloudFrontDistributionId', {
      value: distribution.distributionId,
    })
    new CfnOutput(this, 'CloudFrontDomainName', {
      value: distribution.distributionDomainName,
    })
    new CfnOutput(this, 'GitHubDeployRoleArn', {
      value: deployRole.roleArn,
    })
  }
}

function toRecordName(domainName: string, hostedZoneName: string): string | undefined {
  if (domainName === hostedZoneName) {
    return undefined
  }

  const suffix = `.${hostedZoneName}`
  if (!domainName.endsWith(suffix)) {
    throw new Error(`${domainName} is not inside hosted zone ${hostedZoneName}`)
  }

  return domainName.slice(0, -suffix.length)
}
