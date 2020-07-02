import type { ReactElement } from "react";
import type * as yup from "yup";
import type { FormContextValues } from "react-hook-form";

export type FieldName = string | number;
export type TranslationFunction = (key: string, ...args: unknown[]) => string;

/**
 * Definition for any field.
 *
 * This will be extended by more specific types, but we require that all fields have at least
 * a name and type.
 */
export interface FieldConfig {
  name: FieldName;
  type: string;
}

/**
 * Many fields in an array are considered a Schema.
 */
export type Schema<T extends FieldConfig = FieldConfig> = T[];

/**
 * Context for React rendering, passed to the schema builder.
 */
export interface RenderContext {
  form: FormContextValues;
  // The key property to use when rendering this item. This will be
  // set automatically for you in most cases.
  key?: string | number;
  t?: TranslationFunction;
  parents?: FieldName[];
  renderer?: SchemaRenderer;
}
/**
 * Context for React rendering, passed to the field builder.
 */
export interface FieldRenderContext extends Omit<RenderContext, "renderer"> {
  t: TranslationFunction;
  builder: SchemaBuilder;
  parents: FieldName[];
}

/**
 * Context for Yup schema building, passed to the schema builder.
 */
export interface ValidationContext {
  yup: typeof yup;
  t?: TranslationFunction;
  parents?: FieldName[];
}
/**
 * Context for Yup schema building, passed to the field builder.
 */
export interface FieldValidationContext extends ValidationContext {
  builder: SchemaBuilder;
  t: TranslationFunction;
  parents: FieldName[];
}

/**
 * Defines an object that knows how to deal with entire schemas.
 */
export interface SchemaBuilder<S extends Schema = Schema> {
  render(schema: S, context: RenderContext): ReactElement;
  renderField(config: Unpacked<S>, context: RenderContext): ReactElement;
  buildYupSchema(schema: S, context: ValidationContext): yup.ObjectSchema;
  buildYupSchemaField(
    config: Unpacked<S>,
    context: ValidationContext
  ): yup.Schema<unknown> | false;
}

/**
 * Defines an object that knows how to deal with a particular field schema.
 */
export interface FieldHandler<C extends FieldConfig = FieldConfig> {
  handles(): string[];
  render(config: C, context: FieldRenderContext): React.ReactElement;
  buildYupSchema(
    config: C,
    context: FieldValidationContext
  ): yup.Schema<unknown> | false;
}

// Type to use for a class (not an instance).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructor<T> = new (...args: any[]) => T;

// Utility type grabbed from https://github.com/tildeio/ts-std/issues/3.
// Extracts all properties of a type matching a specific type (eg all string properties).
export type ExtractPropertyNamesOfType<T, S> = {
  [K in keyof T]-?: T[K] extends S ? K : never;
}[keyof T];

// Unpacks a typed array into a union of types
export type Unpacked<T> = T extends (infer U)[] ? U : never;
// Extracts the configuration type for a single FieldHandler.
export type ExtractConfigFromHandler<T> = T extends FieldHandler
  ? Parameters<T["render"]>[0]
  : never;
// Extracts a union configuration type for an array of FieldHandlers
export type ExtractConfigFromHandlers<T> = ExtractConfigFromHandler<
  Unpacked<T>
>;

// Utility type to extract the allowed configuration type from a field builder.
export type ConfigFromFieldHandler<T extends FieldHandler> = Parameters<
  T["render"]
>[0];
// Utility type to extract the allowed configuration type from an array of field handlers.
export type ConfigFromFieldHandlers<
  T extends FieldHandler[]
> = ConfigFromFieldHandler<Unpacked<T>>;
// Utility type to extract the allowed configuration types from a schema builder.
export type SchemaFromSchemaHandler<T extends SchemaBuilder> = Parameters<
  T["render"]
>[0];

export type RenderChildren = Record<string, React.ReactElement>;
export type SchemaRenderProps<
  Fields extends RenderChildren = RenderChildren,
  Context extends RenderContext = RenderContext
> = {
  fields: RenderChildren;
  children: React.ReactNode[];
  context: RenderContext;
};
export type SchemaRenderer<
  Fields extends RenderChildren = RenderChildren,
  Context extends RenderContext = RenderContext
> = React.ComponentType<SchemaRenderProps<Fields, Context>>;

// Defines the shape of a single option (eg: to be used in select lists).
export interface Option {
  value: string;
  label: string;
}
// Defines the shape of a list of options (eg: to be used in select lists).
export type OptionList = Option[];
