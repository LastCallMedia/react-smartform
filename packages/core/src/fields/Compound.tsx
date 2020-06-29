import React from "react";
import type {
  Schema,
  FieldHandler,
  FieldConfig,
  FieldRenderContext,
  FieldValidationContext,
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
  render(config: C, context: FieldRenderContext): React.ReactElement {
    return context.builder.render(this.builder(config), {
      ...context,
      parents: context.parents.concat([config.name]),
      renderer: this.renderer,
    });
  }
  buildYupSchema(
    config: C,
    context: FieldValidationContext
  ): YupSchema<unknown> {
    return context.builder.buildYupSchema(this.builder(config), {
      ...context,
      parents: context.parents.concat([config.name]),
    });
  }
}
