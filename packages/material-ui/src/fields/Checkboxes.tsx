import React from "react";
import {
  FieldConfig,
  FieldHandler,
  FieldRenderContext,
  FieldValidationContext,
  makeElementName,
  withVisibility,
  withLabelExpression,
} from "@lastcall/react-smartform";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Checkbox,
  FormGroup,
  FormHelperText,
} from "@material-ui/core";
import get from "lodash/get";
import * as yup from "yup";
import { prepareOptions } from "../util";
import { Option, OptionsFactory } from "../types";

export interface MaterialCheckboxesConfig extends FieldConfig {
  type: "checkboxes";
  label: string;
  options: string | Option[];
  required?: boolean;
  help?: string;
}

type ConstructorConfig = {
  optionsFactory?: OptionsFactory;
};

class MaterialCheckboxesHandler
  implements FieldHandler<MaterialCheckboxesConfig> {
  optionsFactory?: OptionsFactory;
  constructor(config: ConstructorConfig = {}) {
    this.optionsFactory = config.optionsFactory;
  }
  handles(): string[] {
    return ["checkboxes"];
  }

  render(
    config: MaterialCheckboxesConfig,
    context: FieldRenderContext
  ): React.ReactElement {
    const fqp = context.parents.concat([config.name]);
    const error = get(context.form.errors, `${fqp}.message`);
    const t = (key: string | undefined) => (key ? context.t(key) : undefined);

    return (
      <FormControl component="fieldset" error={!!error}>
        <FormLabel component="legend">{t(config.label)}</FormLabel>
        <FormGroup>
          {this.options(config).map((option) => (
            <FormControlLabel
              key={option.value}
              control={
                <Checkbox
                  name={makeElementName(fqp)}
                  value={option.value}
                  inputRef={context.form.register}
                />
              }
              label={option.label}
            />
          ))}
        </FormGroup>
        {error && <FormHelperText>{error}</FormHelperText>}
        {!error && config.help && (
          <FormHelperText>{t(config.help)}</FormHelperText>
        )}
      </FormControl>
    );
  }

  buildYupSchema(
    config: MaterialCheckboxesConfig,
    context: FieldValidationContext
  ): yup.Schema<unknown> {
    const itemSchema = context.yup
      .string()
      .oneOf(["", ...this.options(config).map(({ value }) => value)]);
    let schema = yup.array().of(itemSchema).label(config.label);
    if (config.required) {
      schema = schema.required();
    }
    return schema;
  }
  private options(config: MaterialCheckboxesConfig): Option[] {
    return prepareOptions(config.options, this.optionsFactory);
  }
}

export default withVisibility(withLabelExpression(MaterialCheckboxesHandler));
