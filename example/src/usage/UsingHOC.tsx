import React from "react";
import {withSmartForm, WithSmartFormProps} from "@lastcall/react-smartform";
import registry from "../registry";
import {Button} from "@material-ui/core";

/**
 * This is an example of using the withSmartForm() HOC to inject SmartForm properties
 * into a component.
 *
 * Here, we inject the registry when invoking the HOC, and the schema must be passed
 * down as a property.
 */
type ComponentProps = WithSmartFormProps;

function Component(props: ComponentProps) {
  const submit = (values: unknown) => console.log(values);
  return (
    <form onSubmit={props.handleSubmit(submit)}>
      {Object.values(props.fields)}
      <Button type="submit">Submit</Button>
    </form>
  )
}

export default withSmartForm(Component, {registry});
