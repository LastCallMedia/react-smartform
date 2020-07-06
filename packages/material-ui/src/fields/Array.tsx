import React from "react";
import { Container } from "@material-ui/core";
import { makeArrayHandler, withVisibility } from "@lastcall/react-smartform";

const MaterialArrayHandler = makeArrayHandler(["array"], (props) => {
  const { fields, context } = props;
  return (
    <Container>
      {context.t(`Item ${context.parent.index + 1}`)}
      {Object.values(fields)}
    </Container>
  );
});

export default withVisibility(MaterialArrayHandler);
