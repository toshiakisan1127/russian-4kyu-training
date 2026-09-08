import {
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
  stage: 'dev' | 'stg' | 'prod'
  webAclArn: string
  certificate?: acm.ICertificate
  domainName?: string
  hostedZoneName?: string
  bucketName: string
  githubOidcProvider: iam.IOpenIdConnectProvider
}

const GITHUB_OWNER = 'toshiakisan1127'
const GITHUB_OWNER_ID = '48203235'
const GITHUB_REPOSITORY = 'russian-4kyu-training'
const GITHUB_REPOSITORY_ID = '1355052125'
const GITHUB_BRANCH = 'main'
const CDK_BOOTSTRAP_QUALIFIER = 'hnb659fds'
const CDK_DEPLOY_REGIONS = ['ap-northeast-1', 'us-east-1'] as const
const CDK_BOOTSTRAP_ROLE_TYPES = ['deploy-role', 'file-publishing-role', 'lookup-role'] as const

export class HostingStack extends Stack {
  constructor(scope: Construct, id: string, props: HostingStackProps) {
    super(scope, id, props)

    if (props.domainName && !props.certificate) {
      throw new Error('certificate is required when domainName is configured')
    }

    const isProd = props.stage === 'prod'

    const bucket = new s3.Bucket(this, 'AppBucket', {
      bucketName: props.bucketName,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
      removalPolicy: isProd ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
      autoDeleteObjects: !isProd,
    })

    const staticHtmlRewriteFunction = new cloudfront.Function(this, 'StaticHtmlRewriteFunction', {
      code: cloudfront.FunctionCode.fromInline(`
function handler(event) {
  var request = event.request;
  var uri = request.uri;

  if (uri.endsWith('/')) {
    request.uri = uri + 'index.html';
    return request;
  }

  var lastSegment = uri.substring(uri.lastIndexOf('/') + 1);
  if (lastSegment.indexOf('.') === -1) {
    request.uri = uri + '/index.html';
  }

  return request;
}
`),
    })

    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultRootObject: 'index.html',
      webAclId: props.webAclArn,
      certificate: props.certificate,
      domainNames: props.domainName ? [props.domainName] : undefined,
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(bucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
        compress: true,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        responseHeadersPolicy: cloudfront.ResponseHeadersPolicy.SECURITY_HEADERS,
        functionAssociations: [
          {
            function: staticHtmlRewriteFunction,
            eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
          },
        ],
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

    const cfnDistribution = distribution.node.defaultChild as cloudfront.CfnDistribution
    cfnDistribution.addPropertyDeletionOverride('DistributionConfig.PriceClass')

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

    const immutableSubject =
      `repo:${GITHUB_OWNER}@${GITHUB_OWNER_ID}/${GITHUB_REPOSITORY}@${GITHUB_REPOSITORY_ID}` +
      `:ref:refs/heads/${GITHUB_BRANCH}`

    const deployRole = new iam.Role(this, 'GitHubDeployRole', {
      roleName: `github-actions-russian-4kyu-${props.stage}-deploy`,
      assumedBy: new iam.WebIdentityPrincipal(
        props.githubOidcProvider.openIdConnectProviderArn,
        {
          StringEquals: {
            'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
            'token.actions.githubusercontent.com:sub': immutableSubject,
          },
        },
      ),
      description: `Deploy russian-4kyu-training ${props.stage} infrastructure and static assets from GitHub Actions`,
    })

    bucket.grantReadWrite(deployRole)

    deployRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ['sts:AssumeRole'],
        resources: CDK_DEPLOY_REGIONS.flatMap((region) =>
          CDK_BOOTSTRAP_ROLE_TYPES.map(
            (roleType) =>
              `arn:${this.partition}:iam::${this.account}:role/cdk-${CDK_BOOTSTRAP_QUALIFIER}-${roleType}-${this.account}-${region}`,
          ),
        ),
      }),
    )

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
