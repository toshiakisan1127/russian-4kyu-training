import { App } from 'aws-cdk-lib'
import { EdgeStack } from '../lib/edge-stack.js'
import { HostingStack } from '../lib/hosting-stack.js'

const app = new App()

const account =
  (app.node.tryGetContext('accountId') as string | undefined) ?? process.env.CDK_DEFAULT_ACCOUNT
const domainName = app.node.tryGetContext('domainName') as string | undefined
const hostedZoneName = (app.node.tryGetContext('hostedZoneName') as string | undefined) ?? domainName
const bucketName = app.node.tryGetContext('bucketName') as string | undefined
const githubOidcProviderArn = app.node.tryGetContext('githubOidcProviderArn') as string | undefined

if (!account) {
  throw new Error(
    'AWS account is required. Configure AWS credentials or pass -c accountId=<AWS_ACCOUNT_ID>.',
  )
}

const edgeStack = new EdgeStack(app, 'Russian4KyuEdgeStack', {
  env: {
    account,
    region: 'us-east-1',
  },
  crossRegionReferences: true,
  domainName,
  hostedZoneName,
})

new HostingStack(app, 'Russian4KyuHostingStack', {
  env: {
    account,
    region: 'ap-northeast-1',
  },
  crossRegionReferences: true,
  webAclArn: edgeStack.webAclArn,
  certificate: edgeStack.certificate,
  domainName,
  hostedZoneName,
  bucketName,
  githubOidcProviderArn,
})
