import * as cfnresponse from 'cfn-response';

export async function main(event: any, context: any) {
    console.info(`Received event ${JSON.stringify(event)}`);

    const {RequestType, ResourceProperties} = event;
    const {FailCreate} = ResourceProperties;

    if (RequestType == 'Create' && FailCreate == false) {
        console.error(`Fail to process Event ${event}`);
        await cfnresponse.send(event, context, cfnresponse.FAILED, {});

    } else {
        const {Message} = ResourceProperties;
        console.info(`Received message ${Message}`);

        await cfnresponse.send(event, context, cfnresponse.SUCCESS, {'Response': `Received message ${Message}`})
    }
}
