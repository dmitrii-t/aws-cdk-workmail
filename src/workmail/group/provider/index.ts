import * as cfnresponse from 'cfn-response';

async function create(props: any): Promise<any> {
    const {Message} = props;
    console.info(`Received message ${Message}`);
    return {'Response': `Received message ${Message}`}
}

async function update(props: any): Promise<any> {
    return Promise.resolve({})
}

async function destroy(props: any): Promise<any> {
    return Promise.resolve({})
}


const requestTypeHandlers: { [key: string]: Function } = {
    'Create': create,
    'Update': update,
    'Delete': destroy
};

async function handle(event: any, context: any): Promise<any> {
    const {RequestType, ResourceProperties} = event;
    const {FailCreate, FailUpdate, FailDelete} = ResourceProperties;

    if (FailCreate || FailUpdate || FailDelete) {
        const error = `Failed to process event ${JSON.stringify(event)}`;
        return Promise.reject(error)

    } else {
        const handler = requestTypeHandlers[RequestType] || (async () => Promise.reject(`Unknown RequestType ${RequestType}`));
        return await handler(ResourceProperties);
    }
}

async function failIn(timeoutInMillis: number): Promise<void> {
    return new Promise(((resolve, reject) => {
        let wait = setTimeout(() => {
            clearTimeout(wait);
            reject(`Fail to create resource in ${timeoutInMillis}`);
        }, timeoutInMillis)
    }));
}

export async function main(event: any, context: any) {
    console.info(`Received event ${JSON.stringify(event)}`);

    try {
        const customData = await Promise.race([handle(event, context), failIn(7000)]);
        await cfnresponse.send(event, context, cfnresponse.SUCCESS, customData || {})

    } catch (error) {
        await cfnresponse.send(event, context, cfnresponse.FAILED, {'Error': error});
    }
}

