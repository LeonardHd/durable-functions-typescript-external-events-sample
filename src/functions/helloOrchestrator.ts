import { InvocationContext } from '@azure/functions';
import * as df from 'durable-functions';
import { ActivityHandler, OrchestrationContext, OrchestrationHandler } from 'durable-functions';

const activityName = 'raiseMyDurableEvent';

const helloOrchestrator: OrchestrationHandler = function* (context: OrchestrationContext) {
    yield context.df.callActivity(activityName, context.df.instanceId);
    while (true) {
        yield context.df.waitForExternalEvent('my-durable-event');
    }
};
df.app.orchestration('helloOrchestrator', helloOrchestrator);

const raiseMyDurableEvent: ActivityHandler = async function (
    input: string,
    context: InvocationContext
) {
    const client = df.getClient(context);
    await client.raiseEvent(input, 'my-durable-event', null);
};
df.app.activity(activityName, {
    handler: raiseMyDurableEvent,
    extraInputs: [df.input.durableClient()]
});
