import { Registry } from "@lastcall/react-smartform";

import MaterialArrayHandler from "./fields/Array";
import MaterialInputHandler from "./fields/Input";
import MaterialCheckboxesHandler from "./fields/Checkboxes";
import MaterialRadiosHandler from "./fields/Radios";
import MaterialSelectHandler from "./fields/Select";
import {OptionsFactory} from "./types";

type MakeRegistryOptions = {
  optionsFactory?: OptionsFactory
}
export function makeRegistry(options: MakeRegistryOptions = {}) {
  const {optionsFactory} = options;
  return new Registry([
    new MaterialArrayHandler(),
    new MaterialInputHandler(),
    new MaterialCheckboxesHandler({optionsFactory}),
    new MaterialRadiosHandler({optionsFactory}),
    new MaterialSelectHandler({optionsFactory})
  ])
}
export const registry = new Registry([
  new MaterialArrayHandler(),
  new MaterialInputHandler(),
  new MaterialCheckboxesHandler(),
  new MaterialRadiosHandler(),
  new MaterialSelectHandler()
]);

export {default as Tree} from "./components/Tree"
