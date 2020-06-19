import React from "react";
import type {
  Schema,
  FieldHandler,
  FieldConfig,
  ReactFieldHandlerContext,
  YupFieldHandlerContext,
  SchemaRenderer,
} from "../types";
import { Schema as YupSchema } from "yup";

export type CompoundSchemaBuilder<C extends FieldConfig = FieldConfig> = (
  config: C
) => Schema;

export default class CompoundFieldHandler<C extends FieldConfig>
  implements FieldHandler<C> {
  types: string[];
  builder: CompoundSchemaBuilder<C>;
  renderer?: SchemaRenderer;

  constructor(
    types: string[],
    schemaBuilder: CompoundSchemaBuilder<C>,
    renderer?: SchemaRenderer
  ) {
    this.types = types;
    this.builder = schemaBuilder;
    this.renderer = renderer;
  }
  handles(): string[] {
    return this.types;
  }
  getReactElement(
    config: C,
    context: ReactFieldHandlerContext
  ): React.ReactElement {
    return context.handler.getReactElement(this.builder(config), {
      ...context,
      parents: context.parents.concat([config.name]),
      renderer: this.renderer,
    });
  }
  getYupSchema(config: C, context: YupFieldHandlerContext): YupSchema<unknown> {
    return context.handler.getYupSchema(this.builder(config), {
      ...context,
      parents: context.parents.concat([config.name]),
    });
  }
}
