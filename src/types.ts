import React from "react";
import * as yup from "yup";
import { FormContextValues } from "react-hook-form";

export type FieldName = string | number;

/**
 * Definition for any field.
 *
 * This will be extended by more specific types, but we require that all fields have at least
 * a name and type.
 */
export interface FieldConfig {
  name: FieldName;
  type: string;
  [k: string]: unknown;
}

/**
 * Many fields in an array are considered a Schema.
 */
export type Schema<T extends FieldConfig = FieldConfig> = T[];

export interface ReactSchemaHandlerContext {
  form: FormContextValues;
  parents?: FieldName[];
}
export interface ReactFieldHandlerContext extends ReactSchemaHandlerContext {
  handler: SchemaHandler;
  parents: FieldName[];
}
export interface YupSchemaHandlerContext {
  yup: typeof yup;
  parents?: FieldName[];
}
export interface YupFieldHandlerContext extends YupSchemaHandlerContext {
  handler: SchemaHandler;
  parents: FieldName[];
}

export interface SchemaHandler<S extends Schema = Schema> {
  getReactElement(
    schema: S,
    context: ReactSchemaHandlerContext
  ): React.ReactElement;
  getReactElementSingle(
    config: Unpacked<S>,
    context: ReactSchemaHandlerContext
  ): React.ReactElement;
  getYupSchema(
    schema: S,
    context: YupSchemaHandlerContext
  ): yup.Schema<unknown>;
  getYupSchemaSingle(
    config: Unpacked<S>,
    context: YupSchemaHandlerContext
  ): yup.Schema<unknown>;
}

export interface FieldHandler<C extends FieldConfig = FieldConfig> {
  handles(): string[];
  getReactElement(
    config: C,
    context: ReactFieldHandlerContext
  ): React.ReactElement;
  getYupSchema(config: C, context: YupFieldHandlerContext): yup.Schema<unknown>;
}

// Unpacks a typed array into a union of types
type Unpacked<T> = T extends (infer U)[] ? U : never;
// Extracts the configuration type for a single FieldHandler.
export type ExtractConfigFromHandler<T> = T extends FieldHandler
  ? Parameters<T["getReactElement"]>[0]
  : never;
// Extracts a union configuration type for an array of FieldHandlers
export type ExtractConfigFromHandlers<T> = ExtractConfigFromHandler<
  Unpacked<T>
>;

export type ConfigFromFieldHandler<T extends FieldHandler> = Parameters<
  T["getReactElement"]
>[0];
export type ConfigFromFieldHandlers<
  T extends FieldHandler[]
> = ConfigFromFieldHandler<Unpacked<T>>;
export type SchemaFromSchemaHandler<T extends SchemaHandler> = Parameters<
  T["getReactElement"]
>[0];
