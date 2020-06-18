import SmartFormSchemaHandler from "../index";
import ArrayHandler from "./Array";
import { Schema } from "../types";
import { fireEvent, render } from "@testing-library/react";
import SmartForm from "../SmartForm";
import React from "react";
import InputHandler from "./Input";
import * as yup from "yup";

describe("ArrayHandler", () => {
  const handler = new ArrayHandler();
  const schemaHandler = new SmartFormSchemaHandler([
    handler,
    new InputHandler(),
  ]);
  const renderSchema = (schema: Schema) =>
    render(<SmartForm handler={schemaHandler} schema={schema} />);

  it("Should render complex array items", () => {
    const { container } = renderSchema([
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
    const { container } = renderSchema([
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
    const { container, getByLabelText } = renderSchema([
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
    const { container, getByLabelText } = renderSchema([
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
    const actual = schemaHandler.getYupSchema(
      [
        {
          name: "myarr",
          type: "array",
          of: { type: "text" },
        },
      ],
      { yup }
    );
    const expected = yup.object({
      myarr: yup.array().of(yup.string()),
    });
    expect(actual.describe()).toEqual(expected.describe());
  });

  it("Should validate complex arrays", () => {
    const actual = schemaHandler.getYupSchema(
      [
        {
          name: "myarr",
          type: "array",
          of: [{ type: "text", name: "mytext" }],
        },
      ],
      { yup }
    );
    const expected = yup.object({
      myarr: yup.array().of(yup.object({ mytext: yup.string() })),
    });
    expect(actual.describe()).toEqual(expected.describe());
  });
});
