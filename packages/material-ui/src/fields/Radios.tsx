import React from "react";
import { Controller } from "react-hook-form";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
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
    const error = get(context.form.errors, `${fqp}.message`);
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
      <FormControl component="fieldset" error={!!error}>
        <FormLabel component="legend">{t(config.label)}</FormLabel>
        <Controller
          id={makeElementId(fqp)}
          name={makeElementName(fqp)}
          control={context.form.control}
          defaultValue={""}
          as={<RadioGroup aria-label={t(config.label)}>{options}</RadioGroup>}
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
