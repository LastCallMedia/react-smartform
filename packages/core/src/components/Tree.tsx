import React from "react";
import { SchemaRenderProps } from "../types";

export default function Tree(props: SchemaRenderProps): React.ReactElement {
  return <>{Object.values(props.fields)}</>;
}
