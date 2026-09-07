import { Stack, type StackProps, aws_iam as iam } from 'aws-cdk-lib'
import type { Construct } from 'constructs'

interface IdentityStackProps extends StackProps {
  githubOidcProviderArn?: string
}

export class IdentityStack extends Stack {
  readonly githubOidcProvider: iam.IOpenIdConnectProvider

  constructor(scope: Construct, id: string, props: IdentityStackProps) {
    super(scope, id, props)

    this.githubOidcProvider = props.githubOidcProviderArn
      ? iam.OpenIdConnectProvider.fromOpenIdConnectProviderArn(
          this,
          'GitHubOidcProvider',
          props.githubOidcProviderArn,
        )
      : new iam.OpenIdConnectProvider(this, 'GitHubOidcProvider', {
          url: 'https://token.actions.githubusercontent.com',
          clientIds: ['sts.amazonaws.com'],
        })
  }
}
