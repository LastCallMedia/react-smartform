import { Option, OptionsFactory } from "./types";
import { RegisterOptions, UseFormRegisterReturn } from "react-hook-form";

function prepareOption(option: string | Option): Option {
  if (typeof option === "string") {
    option = { value: option, label: option };
  }
  if (!("value" in option) || typeof option.value !== "string") {
    throw new Error(`Option detected without a value property`);
  }
  if (!("label" in option) || typeof option.label !== "string") {
    throw new Error(`Option detected without a label property`);
  }
  return option;
}

export function prepareOptions(
  options: string | (string | Option)[],
  factory?: OptionsFactory
): Option[] {
  let preparedOptions;
  if (typeof options === "string") {
    if (!factory) {
      throw new Error(
        `String option list name given, but no option factory has been defined`
      );
    }
    preparedOptions = factory(options);
  } else {
    preparedOptions = options;
  }
  if (preparedOptions.length === 0) {
    throw new Error("No options given.");
  }

  return preparedOptions.map(prepareOption);
}

export function adaptRegister({ref, ...rest} : UseFormRegisterReturn) {
  return {innerRef: ref, ...rest};
}
