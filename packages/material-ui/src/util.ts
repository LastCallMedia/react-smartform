import { OptionList } from "@lastcall/react-smartform";

export const extractOptionValues = (options: OptionList): string[] =>
  options.map((option) => option.value);
