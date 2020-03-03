#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { AwsCdkWorkmailResourceProviderStack } from '../lib/aws-cdk-workmail-resource-provider-stack';

const app = new cdk.App();
new AwsCdkWorkmailResourceProviderStack(app, 'AwsCdkWorkmailResourceProviderStack');
