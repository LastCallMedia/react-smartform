import SmartFormSchemaHandler from "../index";
import InputHandler from "./Input";
import { renderSchema, getYupFieldSchema } from "../testing";
import * as yup from "yup";

describe("InputHandler", function () {
  const fieldHandler = new InputHandler();
  const schemaHandler = new SmartFormSchemaHandler([fieldHandler]);

  it("Should render", () => {
    const { container } = renderSchema(schemaHandler, [
      { type: "number", name: "mynumber" },
      { type: "text", name: "mytext" },
    ]);
    expect(
      container.querySelectorAll('input[type="number"][name="mynumber"]')
    ).toHaveLength(1);
    expect(
      container.querySelectorAll('input[type="text"][name="mytext"]')
    ).toHaveLength(1);
  });

  it("Should optionally render with a placeholder", () => {
    const { getByPlaceholderText } = renderSchema(schemaHandler, [
      { type: "text", name: "mytext", placeholder: true },
    ]);
    expect(getByPlaceholderText("placeholder.mytext")).not.toBeNull();
  });

  it("Should form a base schema", () => {
    const actual = getYupFieldSchema(fieldHandler, {
      type: "text",
      name: "foo",
    });
    const expected = yup.string();
    expect(actual.describe()).toEqual(expected.describe());
  });

  it("Should be require-able", () => {
    const actual = getYupFieldSchema(fieldHandler, {
      type: "text",
      name: "foo",
      required: true,
    });
    const expected = yup.string().required();
    expect(actual.describe()).toEqual(expected.describe());
  });
});
