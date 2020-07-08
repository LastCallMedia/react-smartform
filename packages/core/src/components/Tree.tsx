import React from "react";
import { RenderChildren } from "../types";

export default function Tree(props: {
  fields: RenderChildren;
}): React.ReactElement {
  return (
    <>
      {Object.entries(props.fields).map(([name, child]) => {
        return React.cloneElement(child, { key: name });
      })}
    </>
  );
}
