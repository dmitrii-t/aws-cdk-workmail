export interface Provider<P, R> {
    create: (props: P) => Promise<R>
    update: (props: P) => Promise<R>
    destroy: (props: P) => Promise<R>
}

export function handleWithProvider<P, R>(provider: Provider<P, R>, timeoutInMillis: number = 7000) {

    const cfnresponse = require('../cfn-response');

    const requestTypeHandlers: { [key: string]: Function } = {
        'Create': provider.create,
        'Update': provider.update,
        'Delete': provider.destroy
    };

    const rejectByTimeout = async (): Promise<any> => {
        return new Promise(((resolve, reject) => {
            let wait = setTimeout(() => {
                clearTimeout(wait);
                reject(`Fail to create resource in ${timeoutInMillis}`);
            }, timeoutInMillis)
        }));
    };

    const handle = async (event: any, context: any): Promise<any> => {
        const {RequestType, ResourceProperties} = event;
        const {FailCreate, FailUpdate, FailDelete} = ResourceProperties;

        if (FailCreate || FailUpdate || FailDelete) {
            return Promise.reject(`Failed to process event ${JSON.stringify(event)}`)
        } else {
            const rejectUnknownRequestType = async () => Promise.reject(`Unknown RequestType ${RequestType}`);
            return await (requestTypeHandlers[RequestType] || rejectUnknownRequestType)(ResourceProperties);
        }
    };

    return async (event: any, context: any) => {
        console.debug(`Received event ${JSON.stringify(event)}`);

        try {
            const responseData = await Promise.race([handle(event, context), rejectByTimeout()]);
            await cfnresponse.send(event, context, cfnresponse.SUCCESS, responseData || {})

        } catch (error) {
            console.error(`Failed to process event. ${error}`);
            await cfnresponse.send(event, context, cfnresponse.FAILED, {'Error': error});

        } finally {
            context.done()
        }
    }
}
