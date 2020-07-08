import {Registry} from "@lastcall/react-smartform";
import {makeRegistry as makeMaterialRegistry} from "@lastcall/react-smartform-material-ui";
import CompoundNameHandler from "./elements/CompoundName";

// Instantiate the Material registry:
const materialRegistry = makeMaterialRegistry();

// Add our custom elements to the elements provided by @lastcall/react-smartform-material-ui.
export default materialRegistry.merge(new Registry([
  new CompoundNameHandler()
]));
