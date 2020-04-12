import cdk = require('@aws-cdk/core');
import {WorkmailGroup} from '../src/workmail/group';

/**
 * A stack that sets up MyCustomResource and shows how to get an attribute from it
 */
class SampleStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    const resource = new WorkmailGroup(this, 'WorkmailGroup', {
      message: 'CustomResource says hello',
    });

    // Publish the custom resource output
    new cdk.CfnOutput(this, 'ResponseMessage', {
      description: 'The message that came back from the Custom Resource',
      value: resource.response
    });
  }
}

const app = new cdk.App();
new SampleStack(app, 'WorkmailSampleStack');
app.synth();
