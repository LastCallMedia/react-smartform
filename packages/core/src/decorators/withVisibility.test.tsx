import { DummyHandler, FieldTester } from "../testing";
import * as yup from "yup";
import withVisibility from "./withVisibility";

describe("Visibility Decorator", function () {
  class Extended extends withVisibility(DummyHandler) {}
  const tester = new FieldTester(new Extended());

  it("Should display the field when there are no visibility conditions", () => {
    const { queryAllByTestId } = tester.render({
      name: "test",
      type: "dummy",
    });
    expect(queryAllByTestId("test")).toHaveLength(1);
  });

  it("Should hide the field when the expression evaluates to false", () => {
    const { queryAllByTestId } = tester.render({
      name: "test",
      type: "dummy",
      when: "1 === 0",
    });
    expect(queryAllByTestId("test")).toHaveLength(0);
  });
  it("Should show the field when the expression evaluates to true", () => {
    const { queryAllByTestId } = tester.render({
      name: "test",
      type: "dummy",
      when: "1 === 1",
    });
    expect(queryAllByTestId("test")).toHaveLength(1);
  });

  it("Should not display an element when the element depends on a remote field that does not have the correct value", () => {
    const { queryAllByTestId } = tester.render({
      name: "test",
      type: "dummy",
      when: 'ref("foo") === "bar"',
    });
    expect(queryAllByTestId("test")).toHaveLength(0);
  });

  it("Should display an element when the element depends on a remote field that has the correct value", () => {
    const { queryAllByTestId } = tester.render(
      {
        name: "test",
        type: "dummy",
        when: 'ref("foo") === "bar"',
      },
      { foo: "bar" }
    );
    expect(queryAllByTestId("test")).toHaveLength(1);
  });

  it("Should perform validation on a field when it has a truthy when condition", async () => {
    const actual = tester.getSchema({
      type: "dummy",
      name: "foo",
      required: true,
      when: "1 === 1",
    });
    await expect(actual.validate("")).rejects.toBeTruthy();
    await expect(actual.validate("test")).resolves.toBeTruthy();
  });

  it("Should not perform validation on a field when it has a falsy when condition", async () => {
    const actual = tester.getSchema({
      type: "dummy",
      name: "foo",
      required: true,
      when: "1 === 2",
    });
    await expect(actual.validate("")).resolves.toEqual("");
  });

  it("Should be able to query for the remote value of a field", async () => {
    const yupSchema = yup.object({
      foo: tester.getSchema({
        type: "dummy",
        required: true,
        name: "foo",
        when: 'Number(ref("bar")) === 1',
      }),
    });

    // Validate no error when bar = 2
    await expect(yupSchema.validate({ bar: 2 })).resolves.toBeTruthy();
    // Validate that we show a required error when bar = 1
    await expect(yupSchema.validate({ bar: 1 })).rejects.toBeTruthy();
  });

  it("Should be able to evaluate inclusion expressions", async () => {
    const yupSchema = yup.object({
      foo: tester.getSchema({
        type: "dummy",
        required: true,
        name: "foo",
        when: 'Array(ref("bar")).includes("foo")',
      }),
    });

    // Validate no error when bar = 2
    await expect(yupSchema.validate({ bar: ["baz"] })).resolves.toBeTruthy();
    // Validate that we show a required error when bar = 1
    await expect(yupSchema.validate({ bar: ["foo"] })).rejects.toBeTruthy();
  });

  it("Should be able to evaluate exclusion expressions", async () => {
    const yupSchema = yup.object({
      foo: tester.getSchema({
        type: "dummy",
        required: true,
        name: "foo",
        when: '!Array(ref("bar")).includes("foo")',
      }),
    });

    // Validate no error when bar = ["foo"]
    await expect(yupSchema.validate({ bar: ["foo"] })).resolves.toBeTruthy();
    // Validate that we show a required error when bar does not include "foo"
    await expect(yupSchema.validate({ bar: ["baz"] })).rejects.toBeTruthy();
  });

  it.todo(
    "Should apply when conditions to object fields when we're dealing with a mergeUp schema."
  );

  it("Should hoist yup schema metadata", function () {
    const actual = tester.getSchema({
      type: "text",
      name: "foo",
      metadata: { mergeUp: true },
    });
    expect(actual.meta()).toEqual({ mergeUp: true });

    const invisible = tester.getSchema({
      type: "text",
      name: "foo",
      when: "2 == 2",
      metadata: { mergeUp: true },
    });
    expect(invisible.meta()).toEqual({ mergeUp: true });
  });
});
