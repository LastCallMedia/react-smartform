import React from "react";
import { renderSchema, getYupFieldSchema } from "../testing";
import CompoundFieldHandler, { CompoundSchemaBuilder } from "./Compound";
import SmartFormSchemaHandler from "../SchemaHandler";
import InputHandler from "./Input";
import type { FieldConfig, SchemaRenderer, RenderChildren } from "../types";
import * as yup from "yup";

interface NameWidgetConfig extends FieldConfig {
  type: "name";
  showTitle?: boolean;
}
const builder: CompoundSchemaBuilder<NameWidgetConfig> = (
  config: NameWidgetConfig
) => {
  const schema = [
    { type: "text", name: "first", required: true },
    { type: "text", name: "middle" },
    { type: "text", name: "last", required: true },
  ];
  if (config.showTitle) {
    schema.push({ type: "text", name: "title" });
  }
  return schema;
};

const renderer: SchemaRenderer = (children: RenderChildren) => (
  <div className="name-widget">{Object.values(children)}</div>
);

describe("CompoundFieldHandler", function () {
  const fieldHandler = new CompoundFieldHandler(["name"], builder);
  const schemaHandler = new SmartFormSchemaHandler([
    fieldHandler,
    new InputHandler(),
  ]);

  it("Should render compound fields", () => {
    const { container } = renderSchema(schemaHandler, [
      { name: "your_name", type: "name" },
    ]);
    expect(container.querySelectorAll('[name="your_name.first"]')).toHaveLength(
      1
    );
    expect(
      container.querySelectorAll('[name="your_name.middle"]')
    ).toHaveLength(1);
    expect(container.querySelectorAll('[name="your_name.last"]')).toHaveLength(
      1
    );
    expect(container.querySelectorAll('[name="your_name.title"]')).toHaveLength(
      0
    );
  });

  it("Should allow the builder to make schema changes based on configuration", function () {
    const { container } = renderSchema(schemaHandler, [
      { name: "your_name", type: "name", showTitle: true },
    ]);
    expect(container.querySelectorAll('[name="your_name.title"]')).toHaveLength(
      1
    );
  });

  it("Should allow a custom renderer", function () {
    const fieldHandler = new CompoundFieldHandler(["name"], builder, renderer);
    const schemaHandler = new SmartFormSchemaHandler([
      fieldHandler,
      new InputHandler(),
    ]);
    const { container } = renderSchema(schemaHandler, [
      { name: "your_name", type: "name", showTitle: true },
    ]);
    expect(container.querySelectorAll(".name-widget")).toHaveLength(1);
  });

  it("Should validate child fields", async () => {
    const actual = getYupFieldSchema(
      fieldHandler,
      { name: "your_name", type: "name" },
      { handler: schemaHandler }
    );
    const expected = yup.object({
      first: yup.string().required(),
      middle: yup.string(),
      last: yup.string().required(),
    });
    expect(actual.describe()).toEqual(expected.describe());
  });

  it("Should allow the builder to make validation changes based on configuration", function () {
    const actual = getYupFieldSchema(
      fieldHandler,
      { name: "your_name", type: "name", showTitle: true },
      { handler: schemaHandler }
    );
    const expected = yup.object({
      first: yup.string().required(),
      middle: yup.string(),
      last: yup.string().required(),
      title: yup.string(),
    });
    expect(actual.describe()).toEqual(expected.describe());
  });
});
