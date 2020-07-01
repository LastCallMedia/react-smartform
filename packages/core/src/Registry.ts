import type { FieldHandler } from "./types";

export default class Registry<
  Handlers extends FieldHandler[] = FieldHandler[]
> {
  readonly handlers: Handlers;
  readonly map: Map<string, FieldHandler>;

  constructor(handlers: Handlers) {
    this.handlers = handlers;
    this.map = handlers.reduce((m, handler) => {
      handler.handles().forEach((type) => m.set(type, handler));
      return m;
    }, new Map<string, FieldHandler>());
  }
  getHandler<T extends string>(type: T): FieldHandler {
    const handler = this.map.get(type);
    if (!handler) {
      throw new Error(`No handler for field type: ${type}`);
    }
    return handler;
  }
  merge(other: Registry): Registry {
    return new Registry([...this.handlers, ...other.handlers]);
  }
}
