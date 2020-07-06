import React from "react";
import registry from "../registry";
import {useSmartForm} from "@lastcall/react-smartform";
import {Button} from "@material-ui/core";
import {Schema} from "@lastcall/react-smartform/lib/types";

/**
 * In this example, we use the useSmartForm() hook to build the smartform within our
 * component.
 */
export default function(props: {schema: Schema}) {
  const {schema} = props
  const {fields: rendered, handleSubmit} = useSmartForm({
    schema,
    registry,
  });


  const submit = (values: object) => console.log(values);

  return (
    <form onSubmit={handleSubmit(submit)}>
      {Object.values(rendered)}
      <Button type="submit">Submit</Button>
    </form>
  )
}
