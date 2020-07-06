import {Registry} from "@lastcall/react-smartform";
import materialRegistry from "@lastcall/react-smartform-material-ui";
import CompoundNameHandler from "./elements/CompoundName";

export default materialRegistry.merge(new Registry([
  new CompoundNameHandler()
]));
