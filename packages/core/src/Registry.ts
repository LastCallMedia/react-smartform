import { FieldHandler } from "./types";

export default class Registry<
  Handlers extends FieldHandler[] = FieldHandler[]
> {
  readonly handlers: Handlers;

  constructor(handlers: Handlers) {
    this.handlers = handlers;
  }
  getHandler<T extends string>(type: T): FieldHandler {
    const handler = this.handlers.find((handler) =>
      handler.handles().includes(type)
    );
    if (!handler) {
      throw new Error(`No handler for field type: ${type}`);
    }
    return handler;
  }
  merge(other: Registry): Registry {
    return new Registry([...this.handlers, ...other.handlers]);
  }
}
