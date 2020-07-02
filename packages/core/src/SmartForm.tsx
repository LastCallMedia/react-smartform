import React from "react";
import { useForm, FieldValues } from "react-hook-form";
import type { Schema, SchemaRenderer, TranslationFunction } from "./types";
import Registry from "./Registry";
import * as importedYup from "yup";
import { neverTranslate } from "./util";
import SmartFormSchemaBuilder from "./SchemaBuilder";

type SmartFormProps = {
  registry: Registry;
  schema: Schema;
  render: SchemaRenderer;
  t?: TranslationFunction;
  yup?: typeof importedYup;
  defaultValues: FieldValues;
};

export default function SmartForm(props: SmartFormProps): React.ReactElement {
  const {
    registry,
    schema,
    render: Renderer,
    t = neverTranslate,
    yup = importedYup,
    defaultValues,
    ...rest
  } = props;

  // Memoize the builder instantiation to avoid spurious rerenders.
  const builder = React.useMemo(() => {
    return new SmartFormSchemaBuilder(registry);
  }, [registry]);

  const validationSchema = builder.buildYupSchema(schema, {
    yup,
    t,
  });
  const formContext = useForm({
    defaultValues,
    validationSchema,
  });

  // Wrap the renderer to pass the rest of the props along.
  const WrappedRender = React.useCallback(
    (props) => {
      return <Renderer {...props} {...rest} />;
    },
    [Renderer, rest]
  );

  return builder.render(schema, {
    form: formContext,
    renderer: WrappedRender,
    t,
  });
}
