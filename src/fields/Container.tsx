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
      <div key={config.name} className={config.className}>
        {context.handler.getReactElement(config.of, context)}
      </div>
    );
  }
  getYupSchema(
    config: ContainerConfig,
    context: YupFieldHandlerContext
  ): ObjectSchema {
    // @todo: Implement.
    return context.yup.string();
  }
}
