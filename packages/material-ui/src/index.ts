import * as handlerObj from "./fields";
import { Registry, registry as coreRegistry } from "@lastcall/react-smartform";

const materialRegistry = new Registry(
  Object.values(handlerObj).map((cls) => new cls()),
  {}
);
export const registry = coreRegistry.merge(materialRegistry);
