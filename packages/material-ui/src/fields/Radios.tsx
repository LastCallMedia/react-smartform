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
  withPreparedOptions,
  withLabelExpression,
  withVisibility,
  withValidation,
  FieldConfig,
  FieldHandler,
  FieldRenderContext,
  FieldValidationContext,
  OptionList,
} from "@lastcall/react-smartform";
import * as yup from "yup";
import get from "lodash/get";

interface RadiosConfig extends FieldConfig {
  type: "radios";
  label: string;
  options: OptionList;
  required?: boolean;
  help?: string;
}

class MaterialRadiosHandler implements FieldHandler<RadiosConfig> {
  handles(): string[] {
    return ["radios"];
  }
  render(
    config: RadiosConfig,
    context: FieldRenderContext
  ): React.ReactElement {
    const fqp = context.parents.concat([config.name]);
    const error = get(context.form.errors, `${fqp}.message`);
    const t = (key: string | undefined) => (key ? context.t(key) : undefined);

    const options = config.options.map((option) => (
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
    config: RadiosConfig,
    context: FieldValidationContext
  ): yup.StringSchema {
    let schema = context.yup.string().label(config.label);
    if (config.required) {
      schema = schema.required();
    }
    return schema;
  }
}

export default withVisibility(
  withPreparedOptions(
    withLabelExpression(withValidation(MaterialRadiosHandler))
  )
);
