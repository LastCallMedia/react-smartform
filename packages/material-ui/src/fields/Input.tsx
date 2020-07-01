import React from "react";
import {
  makeElementId,
  makeElementName,
  FieldConfig,
  FieldHandler,
  FieldRenderContext,
  FieldValidationContext,
  withLabelExpression,
  withVisibility,
} from "@lastcall/react-smartform";
import TextField from "@material-ui/core/TextField";
import * as yup from "yup";
import get from "lodash/get";

interface MaterialInputConfig extends FieldConfig {
  name: string | number;
  type: "text" | "password";
  label: string;
  required?: boolean;
  placeholder?: string;
  help?: string;
  autocomplete?: string;
}

class MaterialInputHandler implements FieldHandler<MaterialInputConfig> {
  handles(): string[] {
    return ["text", "password", "email"];
  }
  render(
    config: MaterialInputConfig,
    context: FieldRenderContext
  ): React.ReactElement {
    const fqp = context.parents.concat([config.name]);
    const error = get(context.form.errors, `${fqp}.message`);
    const t = (key: string | undefined) => (key ? context.t(key) : undefined);
    return (
      <TextField
        id={makeElementId(fqp)}
        name={makeElementName(fqp)}
        type={config.type}
        label={t(config.label)}
        required={config.required}
        error={!!error}
        inputRef={context.form.register}
        // Error text is displayed in place of helper text, if an error is present.
        // As per the material design spec: https://material.io/components/text-fields#anatomy
        helperText={error ?? t(config.help)}
        placeholder={t(config.placeholder)}
        autoComplete={config.autocomplete}
      />
    );
  }
  buildYupSchema(
    config: MaterialInputConfig,
    context: FieldValidationContext
  ): yup.StringSchema {
    let schema = context.yup.string().label(context.t(config.label));
    if (config.required) {
      schema = schema.required();
    }
    return schema;
  }
}

export default withVisibility(
  withLabelExpression(MaterialInputHandler)
);
