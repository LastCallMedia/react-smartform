import React from "react";
import { Controller } from "react-hook-form";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  FormHelperText,
  RadioGroup,
  Radio,
} from "@material-ui/core";
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
import * as yup from "yup";
import get from "lodash/get";
import { Option, OptionsFactory } from "../types";
import { prepareOptions } from "../util";

export interface MaterialRadiosConfig extends FieldConfig {
  type: "radios";
  label: string;
  options: string | Option[];
  required?: boolean;
  help?: string;
  inline?: boolean;
}

type ConstructorConfig = {
  optionsFactory?: OptionsFactory;
};

class MaterialRadiosHandler implements FieldHandler<MaterialRadiosConfig> {
  optionsFactory?: OptionsFactory;
  constructor(config: ConstructorConfig = {}) {
    this.optionsFactory = config.optionsFactory;
  }
  handles(): string[] {
    return ["radios"];
  }
  render(
    config: MaterialRadiosConfig,
    context: FieldRenderContext
  ): React.ReactElement {
    const fqp = context.parents.concat([config.name]);
    const name = makeElementName(fqp);
    const error = get(context.form.formState.errors, `${name}.message`) as string|undefined;
    const t = (key: string | undefined) => (key ? context.t(key) : undefined);

    const options = this.options(config).map((option) => (
      <FormControlLabel
        key={option.value}
        control={<Radio />}
        label={option.label}
        value={option.value}
      />
    ));
    return (
      <FormControl
        component="fieldset"
        error={!!error}
        required={!!config.required}
      >
        <FormLabel component="legend">{t(config.label)}</FormLabel>
        <Controller
          name={name}
          control={context.form.control}
          defaultValue={""}
          render={({field}) => (
            <RadioGroup
              id={makeElementId(fqp)}
              row={!!config.inline}
              aria-label={t(config.label)}
              {...field}
            >{options}</RadioGroup>
          )}
        />
        {error && <FormHelperText error={true}>{error}</FormHelperText>}
        {!error && config.help && (
          <FormHelperText>{t(config.help)}</FormHelperText>
        )}
      </FormControl>
    );
  }
  buildYupSchema(
    config: MaterialRadiosConfig,
    context: FieldValidationContext
  ): yup.StringSchema {
    let schema = context.yup.string().label(config.label);

    schema = schema.oneOf([
      "",
      ...this.options(config).map(({ value }) => value),
    ]);
    if (config.required) {
      schema = schema.required();
    }
    return schema;
  }
  private options(config: MaterialRadiosConfig): Option[] {
    return prepareOptions(config.options, this.optionsFactory);
  }
}

export default withVisibility(withLabelExpression(MaterialRadiosHandler));
