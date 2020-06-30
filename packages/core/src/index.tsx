import * as handlerObj from "./fields";
import Registry from "./Registry";

export const registry = new Registry(
  Object.values(handlerObj).map((cls) => new cls())
);

export { makeElementName, makeElementId } from "./util";
export { default as SmartForm } from "./SmartForm";
export { default as Registry } from "./Registry";
export { default as SchemaBuilder } from "./SchemaBuilder";
export { default as withVisibility } from "./decorators/withVisibility";
export { default as withValidation } from "./decorators/withValidation";
export { default as withLabelExpression } from "./decorators/withLabelExpression";
export { default as withPreparedOptions } from "./decorators/withPreparedOptions";
export { default as withAutoProps } from "./decorators/withAutoProps";
export { default as CompoundFieldHandler } from "./fields/Compound";
export { default as makeMarkupHandler } from "./fields/Markup";

export type {
  FieldHandler,
  FieldConfig,
  RenderContext,
  FieldRenderContext,
  ValidationContext,
  FieldValidationContext,
  OptionList,
} from "./types";
