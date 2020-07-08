import React from "react";
import type {
  Schema,
  FieldHandler,
  FieldConfig,
  FieldRenderContext,
  FieldValidationContext,
  RenderChildren,
} from "../types";
import type { Schema as YupSchema } from "yup";
import Tree from "../components/Tree";

export type CompoundRenderer<
  Config extends FieldConfig = FieldConfig
> = React.ComponentType<{
  fields: RenderChildren;
  context: FieldRenderContext;
  config: Config;
}>;

export type CompoundBuilder<Config extends FieldConfig = FieldConfig> = (
  config: Config
) => Schema;

export default class CompoundFieldHandler<Config extends FieldConfig>
  implements FieldHandler<Config> {
  types: string[];
  builder: CompoundBuilder<Config>;
  renderer: CompoundRenderer<Config>;

  constructor(
    types: string[],
    schemaBuilder: CompoundBuilder<Config>,
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
    const fields = builder.renderFields(this.builder(config), {
      ...context,
      parents: parents.concat(config.name),
    });
    return <Renderer context={context} fields={fields} config={config} />;
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
  builder: CompoundBuilder<Config>,
  renderer?: CompoundRenderer<Config>
): new () => CompoundFieldHandler<Config> {
  return class extends CompoundFieldHandler<Config> {
    constructor() {
      super(types, builder, renderer);
    }
  };
}
