import React from "react";
import { useForm } from "react-hook-form";
import type {
  SchemaBuilder,
  SchemaFromSchemaHandler,
  SchemaRenderer,
  TranslationFunction,
} from "./types";
import * as importedYup from "yup";
import { neverTranslate } from "./util";

type SmartFormProps = {
  renderer: SchemaRenderer;
  t?: TranslationFunction;
  yup?: typeof importedYup;
};

export default function SmartForm<
  H extends SchemaBuilder,
  S extends SchemaFromSchemaHandler<H>
>(props: SmartFormProps & { handler: H; schema: S }): React.ReactElement {
  const {
    handler,
    schema,
    renderer: Renderer,
    t = neverTranslate,
    yup = importedYup,
    ...rest
  } = props;
  const formContext = useForm({
    validationSchema: handler.buildYupSchema(schema, {
      yup,
      t,
    }),
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
    t,
  });
}
