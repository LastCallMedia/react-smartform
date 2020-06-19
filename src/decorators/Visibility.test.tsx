import {
  fireEvent,
  renderSchema,
  getYupFieldSchema,
  getYupSchema,
} from "../testing";
import SmartFormSchemaHandler from "../index";
import VisibilityDecorator from "./Visibility";
import InputHandler from "../fields/Input";

describe("VisibilityDecorator", function () {
  const fieldHandler = new VisibilityDecorator(new InputHandler());
  const schemaHandler = new SmartFormSchemaHandler([fieldHandler]);

  it("Should display the field when there are no visibility conditions", () => {
    const { container } = renderSchema(schemaHandler, [
      {
        name: "test",
        type: "text",
      },
    ]);
    expect(container.querySelector("#test")).not.toBeNull();
  });
  it("Should hide the field when the expression evaluates to false", () => {
    const { container } = renderSchema(schemaHandler, [
      {
        name: "test",
        type: "text",
        when: "1 === 0",
      },
    ]);
    expect(container.querySelector("#test")).toBeNull();
  });
  it("Should show the field when the expression evaluates to true", () => {
    const { container } = renderSchema(schemaHandler, [
      {
        name: "test",
        type: "text",
        when: "1 === 1",
      },
    ]);
    expect(container.querySelector("#test")).not.toBeNull();
  });

  it("Should be able to query for the remote value of a field", () => {
    const { container, getByLabelText } = renderSchema(schemaHandler, [
      { name: "mytext", type: "text" },
      { name: "mydep", type: "text", when: 'ref("mytext") === "foo"' },
    ]);
    expect(container.querySelectorAll("#mydep")).toHaveLength(0);
    fireEvent.input(getByLabelText("label.mytext"), {
      target: { value: "foo" },
    });
    expect(container.querySelectorAll("#mydep")).toHaveLength(1);
  });

  it("Should perform validation on a field when it has a truthy when condition", async () => {
    const actual = getYupFieldSchema(fieldHandler, {
      type: "text",
      name: "foo",
      required: true,
      when: "1 === 1",
    });
    await expect(actual.validate("")).rejects.toBeTruthy();
    await expect(actual.validate("test")).resolves.toBeTruthy();
  });

  it("Should not perform validation on a field when it has a falsy when condition", async () => {
    const actual = getYupFieldSchema(fieldHandler, {
      type: "text",
      name: "foo",
      required: true,
      when: "1 === 2",
    });
    await expect(actual.validate("")).resolves.toEqual("");
  });

  it("Should be able to query for the remote value of a field", async () => {
    const actual = getYupSchema(schemaHandler, [
      {
        type: "text",
        name: "foo",
        required: true,
        when: 'Number(ref("bar")) === 1',
      },
      { type: "text", name: "bar" },
    ]);
    // Validate no error when bar = 2
    await expect(actual.validate({ bar: 2 })).resolves.toBeTruthy();
    // Validate that we show a required error when bar = 1
    await expect(actual.validate({ bar: 1 })).rejects.toBeTruthy();
  });
});
