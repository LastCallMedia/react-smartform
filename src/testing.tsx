import React from "react";
import SmartForm from "./SmartForm";
import { render, RenderResult } from "@testing-library/react";
export * from "@testing-library/react";
import {
  SchemaHandler,
  SchemaFromSchemaHandler,
  FieldHandler,
  ConfigFromFieldHandler,
  YupFieldHandlerContext,
} from "./types";
import * as yup from "yup";
import SmartFormSchemaHandler from ".";

export function renderSchema<
  H extends SchemaHandler,
  S extends SchemaFromSchemaHandler<H>
>(handler: H, schema: S): RenderResult {
  return render(<SmartForm handler={handler} schema={schema} />);
}

export function getYupFieldSchema<
  H extends FieldHandler,
  C extends ConfigFromFieldHandler<H>
>(
  handler: H,
  config: C,
  context?: Partial<YupFieldHandlerContext>
): yup.Schema<unknown> {
  const defaultCtx = {
    yup,
    handler: new SmartFormSchemaHandler([]),
    parents: [],
  };
  return handler.getYupSchema(config, { ...defaultCtx, ...(context ?? {}) });
}

export function getYupSchema<
  H extends SchemaHandler,
  S extends SchemaFromSchemaHandler<H>
>(handler: H, schema: S): yup.Schema<unknown> {
  return handler.getYupSchema(schema, { yup });
}
