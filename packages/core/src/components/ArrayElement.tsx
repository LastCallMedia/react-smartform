import React from "react";
import Tree from "./Tree";
import { FieldRenderContext, RenderChildren } from "../types";

const RenderArray = (props: {
  items: RenderChildren[];
  context: FieldRenderContext;
}): React.ReactElement => {
  return (
    <>
      {props.items.map((item, i) => (
        <Tree key={i} fields={item} />
      ))}
    </>
  );
};

export default RenderArray;
