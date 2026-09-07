import {
  Stack,
  type StackProps,
  aws_certificatemanager as acm,
  aws_route53 as route53,
  aws_wafv2 as wafv2,
} from 'aws-cdk-lib'
import type { Construct } from 'constructs'

interface EdgeStackProps extends StackProps {
  domainName?: string
  hostedZoneName?: string
}

export class EdgeStack extends Stack {
  readonly webAclArn: string
  readonly certificate?: acm.ICertificate

  constructor(scope: Construct, id: string, props: EdgeStackProps) {
    super(scope, id, props)

    const webAcl = new wafv2.CfnWebACL(this, 'WebAcl', {
      scope: 'CLOUDFRONT',
      defaultAction: { allow: {} },
      visibilityConfig: {
        cloudWatchMetricsEnabled: true,
        metricName: 'russian-4kyu-web-acl',
        sampledRequestsEnabled: true,
      },
      rules: [
        {
          name: 'rate-limit-per-ip',
          priority: 0,
          action: { block: {} },
          statement: {
            rateBasedStatement: {
              aggregateKeyType: 'IP',
              limit: 500,
            },
          },
          visibilityConfig: {
            cloudWatchMetricsEnabled: true,
            metricName: 'russian-4kyu-rate-limit',
            sampledRequestsEnabled: true,
          },
        },
      ],
    })

    this.webAclArn = webAcl.attrArn

    if (props.domainName) {
      if (!props.hostedZoneName) {
        throw new Error('hostedZoneName is required when domainName is configured')
      }

      const zone = route53.HostedZone.fromLookup(this, 'HostedZone', {
        domainName: props.hostedZoneName,
      })

      this.certificate = new acm.Certificate(this, 'Certificate', {
        domainName: props.domainName,
        validation: acm.CertificateValidation.fromDns(zone),
      })
    }
  }
}
