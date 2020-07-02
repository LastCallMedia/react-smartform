import React from "react";
import { FieldTester, DummyHandler } from "../testing";
import CompoundFieldHandler, {
  CompoundSchemaBuilder,
  makeCompoundHandler,
} from "./Compound";
import type { FieldConfig, SchemaRenderer } from "../types";
import * as yup from "yup";

interface NameWidgetConfig extends FieldConfig {
  type: "name";
  showTitle?: boolean;
}
const builder: CompoundSchemaBuilder<NameWidgetConfig> = (
  config: NameWidgetConfig
) => {
  const schema = [
    { type: "dummy", name: "first", required: true },
    { type: "dummy", name: "middle" },
    { type: "dummy", name: "last", required: true },
  ];
  if (config.showTitle) {
    schema.push({ type: "dummy", name: "title" });
  }
  return schema;
};

const renderer: SchemaRenderer = jest.fn((props) => (
  <div className="name-widget">{props.children}</div>
));

describe("CompoundFieldHandler", function () {
  const tester = new FieldTester(new CompoundFieldHandler(["name"], builder), {
    handlers: [new DummyHandler()],
  });

  it("Should render compound fields", () => {
    const { getByTestId } = tester.render({ name: "your_name", type: "name" });
    getByTestId("your_name.first");
    getByTestId("your_name.middle");
    getByTestId("your_name.last");
  });

  it("Should allow the builder to make schema changes based on configuration", function () {
    const { getByTestId } = tester.render({
      name: "your_name",
      type: "name",
      showTitle: true,
    });
    getByTestId("your_name.first");
    getByTestId("your_name.middle");
    getByTestId("your_name.last");
    getByTestId("your_name.title");
  });

  it("Should allow a custom renderer", function () {
    const tester = new FieldTester(
      new CompoundFieldHandler(["name"], builder, renderer),
      { handlers: [new DummyHandler()] }
    );
    const { container } = tester.render({ name: "your_name", type: "name" });
    expect(container.querySelectorAll(".name-widget")).toHaveLength(1);
  });

  it("Should validate child fields", async () => {
    const actual = tester.getSchema({ name: "your_name", type: "name" });
    const expected = yup.object({
      first: yup.string().required(),
      middle: yup.string(),
      last: yup.string().required(),
    });
    expect(actual.describe()).toEqual(expected.describe());
  });

  it("Should allow the builder to make validation changes based on configuration", function () {
    const actual = tester.getSchema({
      name: "your_name",
      type: "name",
      showTitle: true,
    });
    const expected = yup.object({
      first: yup.string().required(),
      middle: yup.string(),
      last: yup.string().required(),
      title: yup.string(),
    });
    expect(actual.describe()).toEqual(expected.describe());
  });

  it("Should allow construction using a make function", () => {
    const CustomHandler = makeCompoundHandler(["foo"], builder, renderer);
    expect(new CustomHandler()).toEqual(
      new CompoundFieldHandler(["foo"], builder, renderer)
    );
  });
});
