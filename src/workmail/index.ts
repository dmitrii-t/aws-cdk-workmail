import * as cfn from '@aws-cdk/aws-cloudformation';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';

import * as fs from 'fs';

export interface WorkMailResourceProps {
    /**
     * Message to echo
     */
    message: string;
}

export class WorkMailResource extends cdk.Construct {
    public readonly response: string;

    constructor(scope: cdk.Construct, id: string, props: WorkMailResourceProps) {
        super(scope, id);

        const resource = new cfn.CustomResource(this, 'Resource', {
            provider: cfn.CustomResourceProvider.lambda(new lambda.SingletonFunction(this, 'WorkMail', {
                uuid: '2653afeb-4faf-47c5-b024-a514fae699c0',
                code: new lambda.InlineCode(fs.readFileSync('src/workmail/provider/index.js', {encoding: 'utf-8'})),
                handler: 'index.main',
                timeout: cdk.Duration.seconds(300),
                runtime: lambda.Runtime.NODEJS_12_X,
            })),
            properties: props
        });

        this.response = resource.getAtt('Response').toString();
    }
}

