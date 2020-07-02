import {
  ConfigFromFieldHandler,
  FieldHandler,
  Schema,
  SchemaBuilder,
} from "../types";
import * as yup from "yup";
import SmartFormSchemaBuilder from "../SchemaBuilder";
import { FieldValues, useForm, UseFormOptions } from "react-hook-form";
import { act, fireEvent } from "@testing-library/react";
import React from "react";
import { render } from "./index";
import Registry from "../Registry";
import { neverTranslate } from "../util";

type Options = {
  handlers?: FieldHandler[];
  registry?: Registry;
};

export class FieldTester<
  H extends FieldHandler,
  C extends ConfigFromFieldHandler<H>
> {
  fieldHandler: FieldHandler;
  schemaHandler: SchemaBuilder;
  constructor(handler: H, options?: Options) {
    this.fieldHandler = handler;
    this.schemaHandler = new SmartFormSchemaBuilder(
      options?.registry ?? new Registry([...(options?.handlers ?? []), handler])
    );
  }
  render(
    config: C,
    defaultValues?: FieldValues
  ): ReturnType<typeof render> & { submit: () => Promise<FieldValues> } {
    let values: Record<string, unknown>;
    const onSubmit = (data: Record<string, unknown>) => (values = data);
    const rendered = render(
      <TestForm
        submit={onSubmit}
        schema={[config]}
        handler={this.schemaHandler}
        defaultValues={defaultValues}
      />
    );

    return {
      ...rendered,
      async submit() {
        await act(async () => {
          await fireEvent.submit(rendered.getByTestId("the-form"));
        });
        return values;
      },
    };
  }
  getSchema(config: C): yup.Schema<unknown> | false {
    return this.fieldHandler.buildYupSchema(config, {
      yup,
      t: (key: string) => key,
      parents: [],
      builder: this.schemaHandler,
    });
  }
}

type TestFormProps = {
  submit?: (data: Record<string, unknown>) => void;
  schema: Schema;
  handler: SchemaBuilder;
  defaultValues?: UseFormOptions["defaultValues"];
};
export function TestForm(props: TestFormProps): React.ReactElement {
  const t = neverTranslate;
  const form = useForm({
    defaultValues: props.defaultValues,
    validationSchema: props.handler.buildYupSchema(props.schema, { yup, t }),
  });
  const onSubmit = form.handleSubmit(
    props.submit ??
      (() => {
        /* No-op */
      })
  );
  return (
    <form data-testid="the-form" onSubmit={onSubmit}>
      {props.handler.render(props.schema, { form, t })}
    </form>
  );
}
