import Tree from "./Tree";
import React from "react";
import { ArrayRenderer } from "../fields";

const RenderArray: ArrayRenderer = (props) => {
  return (
    <>
      {props.items.map((item, i) => (
        <Tree key={i} fields={item} context={props.context} />
      ))}
    </>
  );
};

export default RenderArray;
