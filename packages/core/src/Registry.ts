import { FieldHandler, OptionList } from "./types";

// Defines a callback that returns an option list.
type OptionListFactory = () => OptionList;
type OptionListMap = Record<string, OptionList | OptionListFactory>;

export default class Registry<
  Handlers extends FieldHandler[] = FieldHandler[]
> {
  readonly handlers: Handlers;
  readonly optionLists: OptionListMap;

  constructor(handlers: Handlers, optionLists: OptionListMap) {
    this.handlers = handlers;
    this.optionLists = optionLists;
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
  getOptionList(name: string): OptionList {
    const list = this.optionLists[name];
    if (!list) {
      throw new Error(`Unable to find named option list: ${name}`);
    }
    return typeof list === "function" ? list() : list;
  }
  merge(other: Registry): Registry {
    return new Registry([...this.handlers, ...other.handlers], {
      ...this.optionLists,
      ...other.optionLists,
    });
  }
}
