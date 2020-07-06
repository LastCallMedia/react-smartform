import React from "react";
import { makeArrayHandler } from "@lastcall/react-smartform";
import { Container } from "@material-ui/core";

const MaterialArrayHandler = makeArrayHandler(["array"], (props) => {
  const { fields, context } = props;
  return (
    <Container>
      {context.t(`Item ${context.parent.index + 1}`)}
      {Object.values(fields)}
    </Container>
  );
});

export default MaterialArrayHandler;
