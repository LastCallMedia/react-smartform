import withValidation from "./withValidation";
import * as yup from "yup";
import { DummyHandler, FieldTester } from "../testing";

describe("Validation decorator", function () {
  class Extended extends withValidation(DummyHandler) {}
  const tester = new FieldTester(new Extended());

  it("Should pass through validation if no conditions are specified", () => {
    const config = { type: "text" as const, name: "test" };
    expect(tester.getSchema(config).describe()).toEqual(
      yup.string().describe()
    );
  });

  it("Should add pattern validation if requested", () => {
    const actual = tester.getSchema({
      type: "text",
      name: "test",
      validate: [{ pattern: "^a$" }],
    });
    const expected = yup.string().matches(/^a$/);
    expect(actual.describe()).toEqual(expected.describe());
  });

  it("Should optionally add messaging for pattern validation", () => {
    const actual = tester.getSchema({
      type: "text",
      name: "test",
      validate: [{ pattern: "^a$", message: "foo" }],
    });
    const expected = yup.string().matches(/^a$/, "foo");
    expect(actual.describe()).toEqual(expected.describe());
  });

  it("Should add matches validation if requested", () => {
    const actual = tester.getSchema({
      type: "text",
      name: "test",
      validate: [{ matches: "foo" }],
    });
    const expected = yup.string().equals([yup.ref("foo")]);
    expect(actual.describe()).toEqual(expected.describe());
  });

  it("Should optionally add messaging for matches validation", () => {
    const actual = tester.getSchema({
      type: "text",
      name: "test",
      validate: [{ matches: "foo", message: "bar" }],
    });
    const expected = yup.string().equals([yup.ref("foo")], "bar");
    expect(actual.describe()).toEqual(expected.describe());
  });

  it("Should hoist metadata up when match validation is used", () => {
    const matches = tester.getSchema({
      type: "text",
      name: "test",
      validate: [{ matches: "abc" }],
      metadata: { mergeUp: true },
    });
    expect(matches.meta()).toEqual({ mergeUp: true });

    const pattern = tester.getSchema({
      type: "text",
      name: "test",
      validate: [{ pattern: "abc" }],
      metadata: { mergeUp: true },
    });
    expect(pattern.meta()).toEqual({ mergeUp: true });
  });
});
