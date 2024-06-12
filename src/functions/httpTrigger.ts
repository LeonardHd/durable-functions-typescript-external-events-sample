const df = require("durable-functions");
import { HttpRequest, HttpResponseInit, InvocationContext, app } from "@azure/functions";
import { DurableClient } from "durable-functions";

export async function httpTrigger(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    let client : DurableClient= df.getClient(context);
    let function_name = request.params.functionName;
    let instanceId = await client.startNew(function_name, undefined);
    return {jsonBody: { instanceId: instanceId }}
};

app.http('httpTrigger', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: httpTrigger,
    route: "orchestrators/{functionName}",
    extraInputs: [df.input.durableClient()]
});
