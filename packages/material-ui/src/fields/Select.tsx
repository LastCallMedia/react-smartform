import React from "react";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import {
  makeElementId,
  makeElementName,
  withValidation,
  withPreparedOptions,
  withVisibility,
  withLabelExpression,
  FieldConfig,
  FieldHandler,
  FieldRenderContext,
  FieldValidationContext,
  OptionList,
} from "@lastcall/react-smartform";
import { Controller } from "react-hook-form";
import * as yup from "yup";
import get from "lodash/get";
import { extractOptionValues } from "../util";

interface MaterialSelectConfig extends FieldConfig {
  name: string;
  type: "select";
  label: string;
  help?: string;
  placeholder?: string;
  options: OptionList;
  required?: boolean;
}
class MaterialSelectHandler implements FieldHandler<MaterialSelectConfig> {
  handles(): string[] {
    return ["select"];
  }

  render(
    config: MaterialSelectConfig,
    context: FieldRenderContext
  ): React.ReactElement {
    const fqp = context.parents.concat([config.name]);
    const error = get(context.form.errors, `${fqp}.message`);
    const t = (key: string | undefined) => (key ? context.t(key) : undefined);

    const opts = config.options.map((o) => {
      return (
        <MenuItem key={o.value} value={o.value}>
          {t(o.label)}
        </MenuItem>
      );
    });

    return (
      <Controller
        control={context.form.control}
        name={makeElementName(fqp)}
        defaultValue=""
        as={
          <TextField
            id={makeElementId(fqp)}
            label={t(config.label)}
            required={config.required}
            error={!!error}
            // Error text is displayed in place of helper text, if an error is present.
            // As per the material design spec: https://material.io/components/text-fields#anatomy
            helperText={error || t(config.help)}
            placeholder={t(config.placeholder)}
            select
          >
            {opts}
          </TextField>
        }
      />
    );
  }
  buildYupSchema(
    config: MaterialSelectConfig,
    context: FieldValidationContext
  ): yup.StringSchema {
    let schema = context.yup.string().label(context.t(config.label));
    schema.oneOf(extractOptionValues(config.options));
    if (config.required) {
      schema = schema.required();
    }
    return schema;
  }
}

export default withVisibility(
  withPreparedOptions(
    withLabelExpression(withValidation(MaterialSelectHandler))
  )
);
