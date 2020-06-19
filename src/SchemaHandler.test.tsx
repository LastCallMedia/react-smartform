import React from "react";
import { FieldHandler } from "./types";
import { renderSchema } from "./testing";
import * as yup from "yup";
import SmartFormSchemaHandler from "./SchemaHandler";

const dummyHandler: FieldHandler = {
  handles: jest.fn(() => ["dummy"]),
  getReactElement: jest.fn(() => <div>dummy</div>),
  getYupSchema: jest.fn(() => yup.string()),
};
const validSchema = [{ type: "dummy", name: "foo" }];
const invalidSchema = [{ type: "baz", name: "baz" }];

describe("SchemaHandler", function () {
  const handler = new SmartFormSchemaHandler([dummyHandler]);

  afterEach(() => jest.clearAllMocks());

  it("Should throw an error when an invalid element type is rendered", function () {
    const spy = jest.spyOn(console, "error");
    spy.mockImplementation(() => {
      // No-op.
    });
    expect(() => {
      renderSchema(handler, invalidSchema);
    }).toThrow("No handler for field type: baz");
    spy.mockRestore();
  });

  it("Should delegate to the handler when a valid element schema is passed", function () {
    const { container } = renderSchema(handler, validSchema);
    expect(dummyHandler.getReactElement).toHaveBeenCalledTimes(1);
    expect(container).toMatchInlineSnapshot(`
      <div>
        <form>
          <div>
            dummy
          </div>
        </form>
      </div>
    `);
  });

  it("Should pass a valid context to children", function () {
    renderSchema(handler, validSchema);
    expect(dummyHandler.getReactElement).toHaveBeenCalledWith(
      validSchema[0],
      expect.objectContaining({
        form: expect.objectContaining({
          register: expect.any(Function),
        }),
        handler,
        parents: [],
      })
    );
  });

  it("Should throw an error when an invalid element type is validated", () => {
    const spy = jest.spyOn(console, "error");
    spy.mockImplementation(() => {
      // No-op.
    });
    expect(() => {
      handler.getYupSchema(invalidSchema, { yup });
    }).toThrow("No handler for field type: baz");
    spy.mockRestore();
  });
});
