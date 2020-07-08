import array from "./array.json";
import checkboxes from "./checkboxes.json";
import compound from "./compound.json"
import radios from "./radios.json";
import select from "./select.json";
import input from "./input.json";
import all from "./all.json";
import type {Schema} from "@lastcall/react-smartform";

export default {
    checkboxes,
    radios,
    select,
    input,
    array,
    compound,
    all,
} as Record<string, Schema>;
