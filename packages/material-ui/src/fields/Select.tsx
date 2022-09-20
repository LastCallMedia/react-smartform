import React from "react";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import {
  makeElementId,
  makeElementName,
  FieldConfig,
  FieldHandler,
  FieldRenderContext,
  FieldValidationContext,
  withVisibility,
  withLabelExpression,
} from "@lastcall/react-smartform";
import { Option, OptionsFactory } from "../types";
import { Controller } from "react-hook-form";
import * as yup from "yup";
import get from "lodash/get";
import { prepareOptions } from "../util";

export interface MaterialSelectConfig extends FieldConfig {
  name: string;
  type: "select";
  label: string;
  help?: string;
  placeholder?: string;
  options: string | Option[];
  required?: boolean;
}

type ConstructorConfig = {
  optionsFactory?: OptionsFactory;
};
class MaterialSelectHandler implements FieldHandler<MaterialSelectConfig> {
  optionsFactory?: OptionsFactory;
  constructor(config: ConstructorConfig = {}) {
    this.optionsFactory = config.optionsFactory;
  }
  handles(): string[] {
    return ["select"];
  }

  render(
    config: MaterialSelectConfig,
    context: FieldRenderContext
  ): React.ReactElement {
    const fqp = context.parents.concat([config.name]);
    const name = makeElementName(fqp);
    const error = get(context.form.formState.errors, `${name}.message`) as string | undefined;
    const t = (key: string | undefined) => (key ? context.t(key) : undefined);

    const opts = this.options(config).map((o) => {
      return (
        <MenuItem key={o.value} value={o.value}>
          {t(o.label)}
        </MenuItem>
      );
    });
    if (config.placeholder) {
      opts.unshift(
        <MenuItem key="__empty" value="" disabled={true}>
          {t(config.placeholder)}
        </MenuItem>
      );
    }

    return (
      <Controller
        control={context.form.control}
        name={name}
        defaultValue=""
        render={({field}) => (
          <TextField
            // name={name}
            id={makeElementId(fqp)}
            label={t(config.label)}
            required={config.required}
            // onChange={onChange}
            // onBlur={onBlur}
            // value={value}
            error={!!error}
            // Error text is displayed in place of helper text, if an error is present.
            // As per the material design spec: https://material.io/components/text-fields#anatomy
            helperText={error || t(config.help)}
            select
            {...field}
          >
            {opts}
          </TextField>
        )}
      />
    );
  }
  buildYupSchema(
    config: MaterialSelectConfig,
    context: FieldValidationContext
  ): yup.StringSchema {
    let schema = context.yup.string().label(context.t(config.label));
    schema = schema.oneOf([
      "",
      ...this.options(config).map(({ value }) => value),
    ]);
    if (config.required) {
      schema = schema.required();
    }
    return schema;
  }
  private options(config: MaterialSelectConfig): Option[] {
    return prepareOptions(config.options, this.optionsFactory);
  }
}

export default withVisibility(withLabelExpression(MaterialSelectHandler));
