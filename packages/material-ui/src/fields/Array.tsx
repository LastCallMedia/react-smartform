import React from "react";
import { Container } from "@material-ui/core";
import {
  ArrayConfig,
  makeArrayHandler,
  withVisibility,
} from "@lastcall/react-smartform";

// Material UI arrays may optionally be labelled.
export interface MaterialArrayConfig extends ArrayConfig {
  label?: string;
}

const MaterialArrayHandler = makeArrayHandler<MaterialArrayConfig>(
  ["array"],
  (props) => {
    const { fields, context } = props;
    const { t, parent } = context;
    const { config } = parent;
    return (
      <Container>
        {config.label && t(config.label)}
        {Object.values(fields)}
      </Container>
    );
  }
);

export default withVisibility(MaterialArrayHandler);
