import { FieldConfig, FieldHandler, FieldRenderContext } from "../types";
import React from "react";
import { makeElementName } from "../util";
import * as yup from "yup";

export interface DummyConfig extends FieldConfig {
  label?: string;
  required?: boolean;
  metadata?: Record<string, unknown>;
  help?: string;
}
export class DummyHandler implements FieldHandler<DummyConfig> {
  handles(): string[] {
    return ["dummy"];
  }
  render(config: DummyConfig, context: FieldRenderContext): React.ReactElement {
    return (
      <span
        className="dummy-input"
        data-testid={makeElementName(context.parents.concat([config.name]))}
      />
    );
  }
  buildYupSchema(config: DummyConfig): yup.Schema<unknown> {
    let schema = yup.string();
    if (config.required) {
      schema = schema.required();
    }
    if (config.metadata) {
      schema = schema.meta(config.metadata);
    }
    return schema;
  }
}
