import { resolveFieldName } from "./util";

describe("resolveFieldName", function () {
  it("Should resolve simple paths", () => {
    expect(resolveFieldName([], "foo")).toEqual("foo");
  });

  it("Should resolve simple paths even when given an array of paths", () => {
    expect(resolveFieldName(["foo", 0], "bar")).toEqual("bar");
  });

  it("Should resolve relative paths including a .", () => {
    expect(resolveFieldName(["foo", 0], "./baz")).toEqual("foo[0].baz");
  });

  it("Should resolve relative paths including a ..", () => {
    expect(resolveFieldName(["foo", 0], "../baz")).toEqual("foo.baz");
  });
});
