import React from "react";
import {
  FieldConfig,
  FieldHandler,
  OptionList,
  FieldRenderContext,
  FieldValidationContext,
  makeElementName,
  withVisibility,
  withLabelExpression,
  withPreparedOptions,
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
import { extractOptionValues } from "../util";

interface MaterialCheckboxesConfig extends FieldConfig {
  type: "checkboxes";
  label: string;
  options: OptionList;
  required?: boolean;
  help?: string;
}

class MaterialCheckboxesHandler
  implements FieldHandler<MaterialCheckboxesConfig> {
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
          {config.options.map((option) => (
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
      .oneOf(extractOptionValues(config.options));
    let schema = yup.array().of(itemSchema).label(config.label);
    if (config.required) {
      schema = schema.required();
    }
    return schema;
  }
}

export default withVisibility(
  withLabelExpression(withPreparedOptions(MaterialCheckboxesHandler))
);
