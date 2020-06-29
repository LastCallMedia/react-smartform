import React from "react";
import { useForm } from "react-hook-form";
import { SchemaBuilder, SchemaFromSchemaHandler } from "./types";
import * as yup from "yup";

export default function SmartForm<
  H extends SchemaBuilder,
  S extends SchemaFromSchemaHandler<H>
>({ handler, schema }: { handler: H; schema: S }): React.ReactElement {
  const formContext = useForm({
    validationSchema: handler.buildYupSchema(schema, { yup }),
  });
  return <form>{handler.render(schema, { form: formContext })}</form>;
}
