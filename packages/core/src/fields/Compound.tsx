import React from "react";
import type {
  Schema,
  FieldHandler,
  FieldConfig,
  FieldRenderContext,
  FieldValidationContext,
  SchemaRenderer,
  RenderChildren,
  FieldName,
  RenderContext,
} from "../types";
import type { Schema as YupSchema } from "yup";

interface CompoundRenderContext extends RenderContext {
  parent: {
    config: FieldConfig;
    parents: FieldName[];
  };
}
export type CompoundRenderer = SchemaRenderer<
  RenderChildren,
  CompoundRenderContext
>;

export type CompoundSchemaBuilder<C extends FieldConfig = FieldConfig> = (
  config: C
) => Schema;

export default class CompoundFieldHandler<C extends FieldConfig>
  implements FieldHandler<C> {
  types: string[];
  builder: CompoundSchemaBuilder<C>;
  renderer?: CompoundRenderer;

  constructor(
    types: string[],
    schemaBuilder: CompoundSchemaBuilder<C>,
    renderer?: CompoundRenderer
  ) {
    this.types = types;
    this.builder = schemaBuilder;
    this.renderer = renderer;
  }
  handles(): string[] {
    return this.types;
  }
  render(config: C, context: FieldRenderContext): React.ReactElement {
    const { builder, parents } = context;
    return builder.render(this.builder(config), {
      ...context,
      parents: parents.concat([config.name]),
      key: config.name,
      renderer: this.renderer,
      parent: {
        config,
        parents: context.parents,
      },
    } as CompoundRenderContext);
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

export function makeCompoundHandler<C extends FieldConfig>(
  types: string[],
  builder: CompoundSchemaBuilder<C>,
  renderer: CompoundRenderer
): new () => CompoundFieldHandler<C> {
  return class extends CompoundFieldHandler<C> {
    constructor() {
      super(types, builder, renderer);
    }
  };
}
