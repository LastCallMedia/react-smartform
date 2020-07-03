import React, { useMemo } from "react";
import Registry from "./Registry";
import SchemaBuilder from "./SchemaBuilder";
import {
  Schema,
  RenderContext,
  ValidationContext,
  RenderChildren,
} from "./types";
import { neverTranslate } from "./util";
import { useForm, UseFormOptions, FormContextValues } from "react-hook-form";
import * as importedYup from "yup";

export type UseSmartFormOptions = {
  registry: Registry;
  schema: Schema;
  formOptions?: UseFormOptions;
  renderContext?: Partial<RenderContext>;
  validationContext?: Partial<ValidationContext>;
};
export type UseSmartFormResult = FormContextValues & { fields: RenderChildren };

export default function useSmartForm(
  options: UseSmartFormOptions
): UseSmartFormResult {
  const {
    registry,
    schema,
    formOptions,
    renderContext,
    validationContext,
  } = options;
  const builder = useMemo(() => {
    return new SchemaBuilder(registry);
  }, [registry]);
  const form = useForm({
    ...formOptions,
    validationSchema: builder.buildYupSchema(schema, {
      yup: importedYup,
      t: neverTranslate,
      ...validationContext,
    }),
  });
  return {
    ...form,
    fields: builder.renderFields(schema, {
      t: neverTranslate,
      ...renderContext,
      form,
    }),
  };
}
export const r = React;
