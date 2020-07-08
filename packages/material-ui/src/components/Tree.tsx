import React from "react";
import { Grid } from "@material-ui/core";
import { RenderChildren } from "@lastcall/react-smartform/lib/types";

export default function Tree(props: {
  fields: RenderChildren;
}): React.ReactElement {
  return (
    <Grid container direction="row" spacing={2}>
      {Object.entries(props.fields).map(([name, field]) => (
        <Grid key={name} item xs={12}>
          {field}
        </Grid>
      ))}
    </Grid>
  );
}
