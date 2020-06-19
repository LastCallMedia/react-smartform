import InputHandler from "../fields/Input";
import ValidationHandler from "./Validation";
import * as yup from "yup";
import { getYupFieldSchema } from "../testing";

describe("Validation decorator", function () {
  const inner = new InputHandler();
  const decorator = new ValidationHandler(inner);

  it("Should pass through validation if no conditions are specified", () => {
    const config = { type: "text" as const, name: "test" };
    const actual = getYupFieldSchema(decorator, config);
    const expected = getYupFieldSchema(inner, config);
    expect(actual.describe()).toEqual(expected.describe());
  });

  it("Should add pattern validation if requested", () => {
    const actual = getYupFieldSchema(decorator, {
      type: "text",
      name: "test",
      validate: [{ pattern: "^a$" }],
    });
    const expected = yup.string().matches(/^a$/);
    expect(actual.describe()).toEqual(expected.describe());
  });

  it("Should optionally add messaging for pattern validation", () => {
    const actual = getYupFieldSchema(decorator, {
      type: "text",
      name: "test",
      validate: [{ pattern: "^a$", message: "foo" }],
    });
    const expected = yup.string().matches(/^a$/, "foo");
    expect(actual.describe()).toEqual(expected.describe());
  });

  it("Should add matches validation if requested", () => {
    const actual = getYupFieldSchema(decorator, {
      type: "text",
      name: "test",
      validate: [{ matches: "foo" }],
    });
    const expected = yup.string().equals([yup.ref("foo")]);
    expect(actual.describe()).toEqual(expected.describe());
  });

  it("Should optionally add messaging for matches validation", () => {
    const actual = getYupFieldSchema(decorator, {
      type: "text",
      name: "test",
      validate: [{ matches: "foo", message: "bar" }],
    });
    const expected = yup.string().equals([yup.ref("foo")], "bar");
    expect(actual.describe()).toEqual(expected.describe());
  });

  it("Should hoist metadata up when match validation is used", () => {
    const inner = new InputHandler();
    inner.getYupSchema = function () {
      return yup.string().meta({ mergeUp: true });
    };
    const decorator = new ValidationHandler(inner);
    const matches = getYupFieldSchema(decorator, {
      type: "text",
      name: "test",
      validate: [{ matches: "abc" }],
    });
    expect(matches.meta()).toEqual({ mergeUp: true });

    const pattern = getYupFieldSchema(decorator, {
      type: "text",
      name: "test",
      validate: [{ pattern: "abc" }],
    });
    expect(pattern.meta()).toEqual({ mergeUp: true });
  });
});
