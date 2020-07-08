import React from "react";
import { FieldTester, DummyHandler } from "../testing";
import CompoundFieldHandler, {
  CompoundBuilder,
  makeCompoundHandler,
} from "./Compound";
import type { FieldConfig } from "../types";
import * as yup from "yup";
import Tree from "../components/Tree";

interface NameWidgetConfig extends FieldConfig {
  type: "name";
  showTitle?: boolean;
}
const builder: CompoundBuilder<NameWidgetConfig> = (
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

const renderer = jest.fn(Tree);
const tester = new FieldTester(
  new CompoundFieldHandler(["name"], builder, renderer),
  {
    handlers: [new DummyHandler()],
  }
);

describe("CompoundFieldHandler", function () {
  beforeEach(jest.clearAllMocks);

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
    renderer.mockImplementation(() => <span data-testid="foo" />);
    const config = { name: "your_name", type: "name" };
    const { getByTestId } = tester.render({ name: "your_name", type: "name" });
    getByTestId("foo");
    expect(renderer).toHaveBeenCalledWith(
      expect.objectContaining({
        fields: expect.objectContaining({
          first: expect.anything(),
          middle: expect.anything(),
          last: expect.anything(),
        }),
        context: expect.anything(),
        config,
      }),
      {}
    );
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
