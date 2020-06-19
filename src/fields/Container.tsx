import type {
  FieldConfig,
  FieldHandler,
  ReactFieldHandlerContext,
  Schema,
  YupFieldHandlerContext,
} from "../types";
import type { ObjectSchema } from "yup";
import React from "react";

export interface ContainerConfig extends FieldConfig {
  type: "container";
  of: Schema;
  className?: string;
}

export default class ContainerHandler implements FieldHandler<ContainerConfig> {
  handles(): string[] {
    return ["container"];
  }
  getReactElement(
    config: ContainerConfig,
    context: ReactFieldHandlerContext
  ): React.ReactElement {
    return (
      <div className={config.className}>
        {context.handler.getReactElement(config.of, context)}
      </div>
    );
  }
  getYupSchema(
    config: ContainerConfig,
    context: YupFieldHandlerContext
  ): ObjectSchema {
    return (
      context.handler
        .getYupSchema(config.of, context)
        // Set a metdata key that allows this schema to be merged "up" to the next level.
        .meta({ mergeUp: true })
    );
  }
}
