import React from "react";
import {FieldConfig, makeCompoundHandler} from "@lastcall/react-smartform";
import {CompoundRenderer, CompoundSchemaBuilder} from "@lastcall/react-smartform/lib/fields/Compound";
import {FormControl, FormLabel, Grid} from "@material-ui/core";

interface NameConfig extends FieldConfig {
  type: 'name'
  label: string
}

// Compound fields use a "builder" to produce the schema for subfields.
const builder: CompoundSchemaBuilder<NameConfig> = (config) => {
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
    }
  ];
};

// Compound fields may use a "renderer" to customize the output of their subfields.
// For example, in this case, we display the name parts side by side.
const renderer: CompoundRenderer<NameConfig> = (props) => {
  const {fields, context} = props;
  const {t, parent} = context;
  const {config} = parent
  return (
    <FormControl component="fieldset">
      <FormLabel>{t(config.label)}</FormLabel>
      <Grid container>
        <Grid item>{fields.first}</Grid>
        <Grid item>{fields.middle}</Grid>
        <Grid item>{fields.last}</Grid>
      </Grid>
    </FormControl>
  )
}

const CompoundNameHandler = makeCompoundHandler<NameConfig>(['name'], builder, renderer);

export default CompoundNameHandler;
