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

interface CompoundRenderContext<Config extends FieldConfig = FieldConfig> extends RenderContext {
  parent: {
    config: Config;
    parents: FieldName[];
  };
}
export type CompoundRenderer<Config extends FieldConfig = FieldConfig> = SchemaRenderer<CompoundRenderContext<Config>>;

export type CompoundSchemaBuilder<Config extends FieldConfig = FieldConfig> = (
  config: Config
) => Schema;

export default class CompoundFieldHandler<Config extends FieldConfig>
  implements FieldHandler<Config> {
  types: string[];
  builder: CompoundSchemaBuilder<Config>;
  renderer: CompoundRenderer<Config>;

  constructor(
    types: string[],
    schemaBuilder: CompoundSchemaBuilder<Config>,
    renderer: CompoundRenderer<Config> = Tree
  ) {
    this.types = types;
    this.builder = schemaBuilder;
    this.renderer = renderer;
  }
  handles(): string[] {
    return this.types;
  }
  render(config: Config, context: FieldRenderContext): React.ReactElement {
    const Renderer = this.renderer;
    const { builder, parents } = context;
    const renderContext = {
      ...context,
      parents: parents.concat([config.name]),
      parent: {
        config,
        parents: context.parents,
      },
    };
    const fields = builder.renderFields(this.builder(config), renderContext);
    return <Renderer context={renderContext} fields={fields} />;
  }
  buildYupSchema(
    config: Config,
    context: FieldValidationContext
  ): YupSchema<unknown> {
    return context.builder.buildYupSchema(this.builder(config), {
      ...context,
      parents: context.parents.concat([config.name]),
    });
  }
}

export function makeCompoundHandler<Config extends FieldConfig>(
  types: string[],
  builder: CompoundSchemaBuilder<Config>,
  renderer?: CompoundRenderer<Config>
): new () => CompoundFieldHandler<Config> {
  return class extends CompoundFieldHandler<Config> {
    constructor() {
      super(types, builder, renderer);
    }
  };
}
