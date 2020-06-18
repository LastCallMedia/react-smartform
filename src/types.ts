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
  when?: string;
  [k: string]: unknown;
}

/**
 * Many fields in an array are considered a Schema.
 */
export type Schema = FieldConfig[];

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

export interface SchemaHandler {
  getReactElement(
    schema: Schema | FieldConfig,
    context: ReactSchemaHandlerContext
  ): React.ReactElement;
  getYupSchema(
    schema: Schema | FieldConfig,
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
