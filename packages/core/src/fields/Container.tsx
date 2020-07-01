import type {
  FieldConfig,
  FieldHandler,
  FieldRenderContext,
  Schema,
  FieldValidationContext,
  FieldName,
  RenderChildren,
  RenderContext,
  SchemaRenderer,
  Constructor,
} from "../types";
import type { ObjectSchema } from "yup";
import React from "react";

interface ContainerRenderContext extends RenderContext {
  container: {
    config: ContainerConfig;
    parents: FieldName[];
  };
}
export type ContainerRenderer = SchemaRenderer<
  RenderChildren,
  ContainerRenderContext
>;

export interface ContainerConfig extends FieldConfig {
  type: "container";
  of: Schema;
}

export default class ContainerHandler implements FieldHandler<ContainerConfig> {
  types: string[];
  renderer?: ContainerRenderer;
  constructor(types: string[] = ["container"], renderer?: ContainerRenderer) {
    this.types = types;
    this.renderer = renderer;
  }
  handles(): string[] {
    return this.types;
  }
  render(
    config: ContainerConfig,
    context: FieldRenderContext
  ): React.ReactElement {
    return context.builder.render(config.of, {
      ...context,
      renderer: this.renderer,
      container: {
        config,
        parents: context.parents,
      },
    } as ContainerRenderContext);
  }
  buildYupSchema(
    config: ContainerConfig,
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

export function makeContainerHandler(
  types: string[],
  renderer: ContainerRenderer
): Constructor<ContainerHandler> {
  return class extends ContainerHandler {
    constructor() {
      super(types, renderer);
    }
  };
}
