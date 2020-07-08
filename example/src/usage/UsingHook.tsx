import React from "react";
import registry from "../registry";
import {Schema, useSmartForm} from "@lastcall/react-smartform";
import {Button} from "@material-ui/core";
import {Tree} from "@lastcall/react-smartform-material-ui";

/**
 * In this example, we use the useSmartForm() hook to build the smartform within our
 * component.
 */
export default function(props: {schema: Schema}) {
  const {schema} = props
  const {fields, handleSubmit} = useSmartForm({
    schema,
    registry,
  });


  const submit = (values: object) => console.log(values);

  return (
    <form noValidate onSubmit={handleSubmit(submit)}>
      <Tree fields={fields} />
      <Button type="submit">Submit</Button>
    </form>
  )
}
