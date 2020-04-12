import * as cfn from '@aws-cdk/aws-cloudformation';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';

export interface WorkmailGroupProps {
    /**
     * Message to echo
     */
    message: string;
}

export class WorkmailGroup extends cdk.Construct {
    public readonly response: string;

    constructor(scope: cdk.Construct, id: string, props: WorkmailGroupProps) {
        super(scope, id);

        const resource = new cfn.CustomResource(this, 'Resource', {
            provider: cfn.CustomResourceProvider.lambda(new lambda.SingletonFunction(this, 'WorkMailGroup', {
                uuid: 'c17c1e58-22d8-4d1f-a456-7469a7ab73fe',
                code: new lambda.AssetCode('src/workmail/group/provider'),
                handler: 'index.main',
                timeout: cdk.Duration.seconds(10),
                runtime: lambda.Runtime.NODEJS_12_X,
            })),
            properties: props
        });

        this.response = resource.getAtt('Response').toString();
    }
}

