import { Registry } from "@lastcall/react-smartform";

import MaterialArrayHandler from "./fields/Array";
import MaterialInputHandler from "./fields/Input";
import MaterialCheckboxesHandler from "./fields/Checkboxes";
import MaterialRadiosHandler from "./fields/Radios";

const registry = new Registry([
  new MaterialArrayHandler(),
  new MaterialInputHandler(),
  new MaterialCheckboxesHandler(),
  new MaterialRadiosHandler(),
]);

export default registry;
