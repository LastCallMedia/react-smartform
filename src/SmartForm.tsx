import React from "react";
import { useForm } from "react-hook-form";
import { SchemaHandler, SchemaFromSchemaHandler } from "./types";

export default function SmartForm<
  H extends SchemaHandler,
  S extends SchemaFromSchemaHandler<H>
>({ handler, schema }: { handler: H; schema: S }): React.ReactElement {
  const formContext = useForm();
  return <form>{handler.getReactElement(schema, { form: formContext })}</form>;
}
