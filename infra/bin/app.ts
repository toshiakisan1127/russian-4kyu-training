import { App } from 'aws-cdk-lib'
import { EdgeStack } from '../lib/edge-stack.js'
import { HostingStack } from '../lib/hosting-stack.js'
import { IdentityStack } from '../lib/identity-stack.js'

const app = new App()

const account =
  (app.node.tryGetContext('accountId') as string | undefined) ?? process.env.CDK_DEFAULT_ACCOUNT
const stage = (app.node.tryGetContext('stage') as string | undefined) ?? 'prod'
const domainName = app.node.tryGetContext('domainName') as string | undefined
const hostedZoneName = (app.node.tryGetContext('hostedZoneName') as string | undefined) ?? domainName
const githubOidcProviderArn = app.node.tryGetContext('githubOidcProviderArn') as string | undefined

if (!account) {
  throw new Error(
    'AWS account is required. Configure AWS credentials or pass -c accountId=<AWS_ACCOUNT_ID>.',
  )
}

if (!['dev', 'stg', 'prod'].includes(stage)) {
  throw new Error(`stage must be one of dev, stg, prod. Received: ${stage}`)
}

const deploymentStage = stage as 'dev' | 'stg' | 'prod'
const bucketName =
  (app.node.tryGetContext('bucketName') as string | undefined) ??
  `russian4kyu-training-${deploymentStage}-${account}`

const identityStack = new IdentityStack(app, 'Russian4KyuIdentityStack', {
  env: {
    account,
    region: 'ap-northeast-1',
  },
  githubOidcProviderArn,
})

const edgeStack = new EdgeStack(app, `Russian4KyuEdgeStack-${deploymentStage}`, {
  env: {
    account,
    region: 'us-east-1',
  },
  crossRegionReferences: true,
  stage: deploymentStage,
  domainName,
  hostedZoneName,
})

new HostingStack(app, `Russian4KyuHostingStack-${deploymentStage}`, {
  env: {
    account,
    region: 'ap-northeast-1',
  },
  crossRegionReferences: true,
  stage: deploymentStage,
  webAclArn: edgeStack.webAclArn,
  certificate: edgeStack.certificate,
  domainName,
  hostedZoneName,
  bucketName,
  githubOidcProvider: identityStack.githubOidcProvider,
})
