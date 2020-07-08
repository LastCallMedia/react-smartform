import React from "react";
import { SchemaRenderProps } from "../types";

export default function Tree(props: SchemaRenderProps): React.ReactElement {
  return (
    <>
      {Object.entries(props.fields).map(([name, child]) => {
        return React.cloneElement(child, { key: name });
      })}
    </>
  );
}
