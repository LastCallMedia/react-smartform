import type {
  FieldConfig,
  FieldHandler,
  FieldRenderContext,
  Schema,
  FieldValidationContext,
  Constructor,
  RenderChildren,
} from "../types";
import type { ObjectSchema } from "yup";
import React from "react";
import Tree from "../components/Tree";

export type ContainerRenderer<
  Config extends ContainerConfig = ContainerConfig
> = React.ComponentType<{
  fields: RenderChildren;
  context: FieldRenderContext;
  config: Config;
}>;

export interface ContainerConfig extends FieldConfig {
  type: "container";
  of: Schema;
}

export default class ContainerHandler<
  Config extends ContainerConfig = ContainerConfig
> implements FieldHandler<Config> {
  types: string[];
  renderer: ContainerRenderer<Config>;
  constructor(
    types: string[] = ["container"],
    renderer: ContainerRenderer<Config> = Tree
  ) {
    this.types = types;
    this.renderer = renderer;
  }
  handles(): string[] {
    return this.types;
  }
  render(config: Config, context: FieldRenderContext): React.ReactElement {
    const fields = context.builder.renderFields(config.of, context);
    const Renderer = this.renderer;
    return <Renderer context={context} fields={fields} config={config} />;
  }
  buildYupSchema(
    config: Config,
    context: FieldValidationContext
  ): ObjectSchema {
    return (
      context.builder
        .buildYupSchema(config.of, context)
        // Set a metadata key that allows this schema to be merged "up" to the next level.
        .meta({ mergeUp: true })
    );
  }
}

export function makeContainerHandler<
  Config extends ContainerConfig = ContainerConfig
>(
  types: string[],
  renderer: ContainerRenderer<Config>
): Constructor<ContainerHandler<Config>> {
  return class extends ContainerHandler<Config> {
    constructor() {
      super(types, renderer);
    }
  };
}
