import { QuadratsReactEditor } from '..';
import {
  EventHandlerName,
  EventHandlers,
  GetEventByName,
  Handler,
} from './typings/handler';

function createEventHandler(
  editor: QuadratsReactEditor,
  handlers: Handler<any>[],
): (event: GetEventByName<any>) => void {
  const [handler, ...restHandlers] = handlers;

  return event => handler(event, editor, () => {
    const next = restHandlers.length > 0 ? createEventHandler(editor, restHandlers) : () => {};

    next(event);
  });
}

/**
 * To compose sequential `event handlers` to single for each event types.
 */
export function composeHandlers<H extends EventHandlerName>(
  handlersList: {
    [HH in H]?: Handler<HH>;
  }[],
): (editor: QuadratsReactEditor) => EventHandlers {
  const handlersListRecord = handlersList.reduce(
    (acc, handlers) => {
      Object.entries(handlers).forEach(([key, value]) => {
        const name = key as H;
        const handler = value as Handler<H>;
        const origin = acc[name] as Handler<H>[] | undefined;

        if (origin) {
          origin.push(handler);
        } else {
          acc[name] = [handler];
        }
      });

      return acc;
    },
    {} as {
      [HH in H]?: Handler<HH>[];
    },
  );

  const handlersEntries = Object.entries(handlersListRecord) as [H, Handler<any>[]][];

  return editor => handlersEntries.reduce((acc, [name, handlers]) => {
    acc[name] = createEventHandler(editor, handlers);

    return acc;
  }, {} as EventHandlers);
}
