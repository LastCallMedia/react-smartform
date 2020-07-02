import * as handlerObj from "./fields";
import { Registry } from "@lastcall/react-smartform";

export const registry = new Registry(
  Object.values(handlerObj).map((cls) => new cls())
);
