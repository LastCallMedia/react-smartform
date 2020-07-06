import type {
  FieldConfig,
  FieldHandler,
  FieldRenderContext,
  Schema,
  FieldValidationContext,
  FieldName,
  RenderContext,
  SchemaRenderer,
  Constructor,
} from "../types";
import type { ObjectSchema } from "yup";
import React from "react";
import Tree from "../components/Tree";

interface ContainerRenderContext extends RenderContext {
  parent: {
    config: ContainerConfig;
    parents: FieldName[];
  };
}
export type ContainerRenderer = SchemaRenderer<ContainerRenderContext>;

export interface ContainerConfig extends FieldConfig {
  type: "container";
  of: Schema;
}

export default class ContainerHandler implements FieldHandler<ContainerConfig> {
  types: string[];
  renderer: ContainerRenderer;
  constructor(
    types: string[] = ["container"],
    renderer: ContainerRenderer = Tree
  ) {
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
    const renderContext = {
      ...context,
      renderer: this.renderer,
      parent: {
        config,
        parents: context.parents,
      },
    } as ContainerRenderContext;
    const fields = context.builder.renderFields(config.of, renderContext);
    const Renderer = this.renderer;
    return <Renderer context={renderContext} fields={fields} />;
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
