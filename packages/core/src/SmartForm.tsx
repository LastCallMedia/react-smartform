import React from "react";
import { useForm } from "react-hook-form";
import type {
  SchemaBuilder,
  SchemaFromSchemaHandler,
  SchemaRenderer,
} from "./types";
import * as yup from "yup";

type SmartFormProps = {
  renderer: SchemaRenderer;
};

export default function SmartForm<
  H extends SchemaBuilder,
  S extends SchemaFromSchemaHandler<H>
>(props: SmartFormProps & { handler: H; schema: S }): React.ReactElement {
  const { handler, schema, renderer: Renderer, ...rest } = props;
  const formContext = useForm({
    validationSchema: handler.buildYupSchema(schema, { yup }),
  });

  const WrappedRender = React.useCallback(
    (props) => {
      return <Renderer {...props} {...rest} />;
    },
    [props.renderer, rest]
  );

  return handler.render(schema, {
    form: formContext,
    renderer: WrappedRender,
  });
}
