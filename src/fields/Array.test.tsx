import SmartFormSchemaHandler from "../SchemaHandler";
import ArrayHandler from "./Array";
import { fireEvent, renderSchema, getYupFieldSchema } from "../testing";
import InputHandler from "./Input";
import * as yup from "yup";

describe("ArrayHandler", () => {
  const fieldHandler = new ArrayHandler();
  const schemaHandler = new SmartFormSchemaHandler([
    fieldHandler,
    new InputHandler(),
  ]);

  it("Should render complex array items", () => {
    const { container } = renderSchema(schemaHandler, [
      {
        type: "array",
        name: "myarr",
        count: 2,
        of: [{ name: "text", type: "text" }],
      },
    ]);
    expect(
      container.querySelectorAll('input[name="myarr[0].text"]')
    ).toHaveLength(1);
    expect(
      container.querySelectorAll('input[name="myarr[1].text"]')
    ).toHaveLength(1);
  });

  it("Should render simple array items", () => {
    const { container } = renderSchema(schemaHandler, [
      {
        type: "array",
        name: "myarr",
        count: 2,
        of: { type: "text" },
      },
    ]);
    expect(container.querySelectorAll('input[name="myarr[0]"]')).toHaveLength(
      1
    );
    expect(container.querySelectorAll('input[name="myarr[1]"]')).toHaveLength(
      1
    );
  });

  it("Should allow count to be controlled by another field", async () => {
    const { container, getByLabelText } = renderSchema(schemaHandler, [
      {
        name: "mynumber",
        type: "number",
      },
      {
        type: "array",
        name: "myarr",
        count: "value(mynumber)",
        of: { type: "text" },
      },
    ]);
    expect(container.querySelectorAll('input[name="myarr[0]"]')).toHaveLength(
      0
    );
    fireEvent.input(getByLabelText("label.mynumber"), {
      target: { value: "2" },
    });
    expect(container.querySelectorAll('input[id^="myarr-"]')).toHaveLength(2);
  });

  it("Should allow count to be controlled by a relative field", async () => {
    const { container, getByLabelText } = renderSchema(schemaHandler, [
      {
        type: "array",
        name: "myarr",
        count: 1,
        of: [
          { name: "cnt", type: "number" },
          {
            type: "array",
            name: "mynestedarr",
            count: "value(./cnt)",
            of: { type: "text" },
          },
        ],
      },
    ]);
    expect(
      container.querySelectorAll('input[name="myarr[0].mynestedarr[0]"]')
    ).toHaveLength(0);
    fireEvent.input(getByLabelText("label.myarr.cnt"), {
      target: { value: "2" },
    });
    expect(
      container.querySelectorAll('input[id^="myarr-0-mynestedarr-"]')
    ).toHaveLength(2);
  });

  it("Should validate simple arrays", () => {
    const actual = getYupFieldSchema(
      fieldHandler,
      {
        name: "myarr",
        type: "array",
        count: 1,
        of: { type: "text" },
      },
      { handler: schemaHandler }
    );
    const expected = yup.array().of(yup.string());
    expect(actual.describe()).toEqual(expected.describe());
  });

  it("Should validate complex arrays", () => {
    const actual = getYupFieldSchema(
      fieldHandler,
      {
        name: "myarr",
        type: "array",
        count: 1,
        of: [{ type: "text", name: "mytext" }],
      },
      { handler: schemaHandler }
    );
    const expected = yup.array().of(yup.object({ mytext: yup.string() }));
    expect(actual.describe()).toEqual(expected.describe());
  });
});
