export const SUCCESS = "SUCCESS";
export const FAILED = "FAILED";

export async function send(event: any,
                           context: any,
                           responseStatus: string,
                           responseData: any = {},
                           physicalResourceId: string = context.logStreamName,
                           noEcho: boolean = false): Promise<any> {

    const responseBody = JSON.stringify({
        Status: responseStatus,
        Reason: "See the details in CloudWatch Log Stream: " + context.logStreamName,
        PhysicalResourceId: physicalResourceId,
        StackId: event.StackId,
        RequestId: event.RequestId,
        LogicalResourceId: event.LogicalResourceId,
        NoEcho: noEcho,
        Data: responseData
    });

    console.debug("Response body:\n", responseBody);

    const https = require("https");
    const url = require("url");

    const parsedUrl = url.parse(event.ResponseURL);
    const options = {
        hostname: parsedUrl.hostname,
        port: 443,
        path: parsedUrl.path,
        method: "PUT",
        headers: {
            "content-type": "",
            "content-length": responseBody.length
        }
    };

    return new Promise((resolve, reject) => {
        const request = https.request(options, function (response: any) {
            console.log("Status code: " + response.statusCode);
            console.log("Status message: " + response.statusMessage);
            resolve(response);
            //context.done();
        });

        request.on("error", function (error: any) {
            console.log("send(..) failed executing https.request(..): " + error);
            reject(error);
            //context.done();
        });

        request.write(responseBody);
        request.end();
    })

}
