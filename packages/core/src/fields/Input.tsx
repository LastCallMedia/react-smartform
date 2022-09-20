import type {
  FieldConfig,
  FieldHandler,
  FieldRenderContext,
  FieldValidationContext,
} from "../types";
import withVisibility from "../decorators/withVisibility";
import type { StringSchema } from "yup";
import { makeElementId, makeElementLabel, makeElementName } from "../util";
import React from "react";
import get from "lodash/get";
import withLabelExpression from "../decorators/withLabelExpression";

export interface InputConfig extends FieldConfig {
  name: string;
  type: "text" | "number" | "tel" | "password";
  label: string;
  placeholder?: string;
  required?: boolean;
}

class InputHandler implements FieldHandler<InputConfig> {
  handles(): string[] {
    return ["text", "number", "tel", "password"];
  }
  render(config: InputConfig, context: FieldRenderContext): React.ReactElement {
    const fqp = context.parents.concat([config.name]);
    const name = makeElementName(fqp);
    const id = makeElementId(fqp);
    const error = get(context.form.formState.errors, `${fqp}.message`) as string|undefined;
    return (
      <div>
        <label htmlFor={id}>{config.label}</label>
        <input
          id={id}
          placeholder={
            config.placeholder
              ? makeElementLabel(
                  context.parents.concat(config.name),
                  "placeholder"
                )
              : undefined
          }
          type={config.type}
          {...context.form.register(name)}
        />
        {error && <p>{error}</p>}
      </div>
    );
  }
  buildYupSchema(
    config: InputConfig,
    context: FieldValidationContext
  ): StringSchema {
    let schema = context.yup.string().label(config.label);
    if (config.required) {
      schema = schema.required();
    }
    return schema;
  }
}

export default withVisibility(withLabelExpression(InputHandler));
