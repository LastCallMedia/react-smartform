import React from "react";
import {
  FieldConfig,
  makeCompoundHandler,
  CompoundBuilder,
  CompoundRenderer
} from "@lastcall/react-smartform";
import {FormControl, FormLabel, Grid, FormHelperText} from "@material-ui/core";

interface NameConfig extends FieldConfig {
  type: 'name'
  label: string
  help?: string
}

// Compound fields use a "builder" to produce the schema for subfields.
const builder: CompoundBuilder<NameConfig> = (config) => {
  return [
    {
      name: "first",
      type: "text",
      label: "First Name",
    },
    {
      name: "middle",
      type: "text",
      label: "Middle Initial",
    },
    {
      name: "last",
      type: "text",
      label: "Last Name",
      required: true,
    }
  ];
};

// Compound fields may use a "renderer" to customize the output of their subfields.
// For example, in this case, we display the name parts side by side.
const renderer: CompoundRenderer<NameConfig> = (props) => {
  const {fields, context, config} = props;
  const {t} = context;
  return (
    <FormControl component="fieldset">
      <FormLabel>{t(config.label)}</FormLabel>
      <Grid container>
        <Grid item>{fields.first}</Grid>
        <Grid item>{fields.middle}</Grid>
        <Grid item>{fields.last}</Grid>
      </Grid>
      {config.help && <FormHelperText>{config.help}</FormHelperText>}
    </FormControl>
  )
}

const CompoundNameHandler = makeCompoundHandler<NameConfig>(['name'], builder, renderer);

export default CompoundNameHandler;
