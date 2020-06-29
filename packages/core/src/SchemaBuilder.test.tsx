import React from "react";
import { DummyHandler, render } from "./testing";
import * as yup from "yup";
import SmartFormSchemaBuilder from "./SchemaBuilder";
import Registry from "./Registry";
import { SchemaFromSchemaHandler, SchemaBuilder } from "./types";
import { RenderResult } from "@testing-library/react";
import SmartForm from "./SmartForm";

const validSchema = [{ type: "dummy", name: "foo" }];
const invalidSchema = [{ type: "baz", name: "baz" }];

function renderSchema<
  H extends SchemaBuilder,
  S extends SchemaFromSchemaHandler<H>
>(handler: H, schema: S): RenderResult {
  return render(<SmartForm handler={handler} schema={schema} />);
}

describe("SchemaHandler", function () {
  const dummyHandler = new DummyHandler();
  const builder = new SmartFormSchemaBuilder(new Registry([dummyHandler]));

  afterEach(() => jest.clearAllMocks());

  it("Should throw an error when an invalid element type is rendered", function () {
    const spy = jest.spyOn(console, "error");
    spy.mockImplementation(() => {
      // No-op.
    });
    expect(() => {
      renderSchema(builder, invalidSchema);
    }).toThrow("No handler for field type: baz");
    spy.mockRestore();
  });

  it("Should delegate to the builder when a valid element schema is passed", function () {
    const spy = jest.spyOn(dummyHandler, "render");
    const { container } = renderSchema(builder, validSchema);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(container).toMatchInlineSnapshot(`
      <div>
        <form>
          <span
            class="dummy-input"
            data-testid="foo"
          />
        </form>
      </div>
    `);
    spy.mockRestore();
  });

  it("Should pass a valid context to children", function () {
    const spy = jest.spyOn(dummyHandler, "render");
    renderSchema(builder, validSchema);
    expect(spy).toHaveBeenCalledWith(
      validSchema[0],
      expect.objectContaining({
        form: expect.objectContaining({
          register: expect.any(Function),
        }),
        builder,
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
      builder.buildYupSchema(invalidSchema, { yup });
    }).toThrow("No handler for field type: baz");
    spy.mockRestore();
  });

  it.todo("Should allow a custom renderer to be passed");
});
