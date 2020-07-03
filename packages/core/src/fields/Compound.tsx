import React from "react";
import type {
  Schema,
  FieldHandler,
  FieldConfig,
  FieldRenderContext,
  FieldValidationContext,
  SchemaRenderer,
  FieldName,
  RenderContext,
} from "../types";
import type { Schema as YupSchema } from "yup";
import Tree from "../components/Tree";

interface CompoundRenderContext extends RenderContext {
  parent: {
    config: FieldConfig;
    parents: FieldName[];
  };
}
export type CompoundRenderer =
  | SchemaRenderer<CompoundRenderContext>
  | SchemaRenderer;

export type CompoundSchemaBuilder<C extends FieldConfig = FieldConfig> = (
  config: C
) => Schema;

export default class CompoundFieldHandler<C extends FieldConfig>
  implements FieldHandler<C> {
  types: string[];
  builder: CompoundSchemaBuilder<C>;
  renderer: CompoundRenderer;

  constructor(
    types: string[],
    schemaBuilder: CompoundSchemaBuilder<C>,
    renderer: CompoundRenderer = Tree
  ) {
    this.types = types;
    this.builder = schemaBuilder;
    this.renderer = renderer;
  }
  handles(): string[] {
    return this.types;
  }
  render(config: C, context: FieldRenderContext): React.ReactElement {
    const Renderer = this.renderer;
    const { builder, parents } = context;
    const renderContext = {
      ...context,
      parents: parents.concat([config.name]),
      parent: {
        config,
        parents: context.parents,
      },
    } as CompoundRenderContext;
    const fields = builder.renderFields(this.builder(config), renderContext);
    return <Renderer context={renderContext} fields={fields} />;
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
