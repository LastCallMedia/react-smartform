import React from "react";
import withAutoProps from "./withAutoProps";
import { DummyHandler, FieldTester } from "../testing";

const renderMock = jest.fn(() => <span />);
DummyHandler.prototype.render = renderMock;

describe("withAutoProps", () => {
  class WrappedDummy extends withAutoProps(DummyHandler, ["label"], ["help"]) {}
  const tester = new FieldTester(new WrappedDummy());

  afterEach(() => jest.clearAllMocks());

  it("Should pass the label property through when one is given", () => {
    tester.render({ type: "dummy", name: "foo", label: "foo" });
    expect(renderMock).toHaveBeenCalledWith(
      expect.objectContaining({
        label: "foo",
      }),
      expect.anything()
    );
  });

  it("Should add always-add properties", () => {
    tester.render({ type: "dummy", name: "foo" });
    expect(renderMock).toHaveBeenCalledWith(
      expect.objectContaining({
        label: "label.foo",
      }),
      expect.anything()
    );
  });

  it("Should not add maybe-add properties when they are not defined", () => {
    tester.render({ type: "dummy", name: "foo" });
    expect(renderMock).toHaveBeenCalledWith(
      expect.not.objectContaining({
        help: expect.anything(),
      }),
      expect.anything()
    );
  });

  it("Should add maybe-add properties when they are true", () => {
    tester.render({ type: "dummy", name: "foo", help: true });
    expect(renderMock).toHaveBeenCalledWith(
      expect.objectContaining({
        help: "help.foo",
      }),
      expect.anything()
    );
  });

  it("Should not add maybe-add properties when they are already set", () => {
    tester.render({ type: "dummy", name: "foo", help: "this is helpful" });
    expect(renderMock).toHaveBeenCalledWith(
      expect.objectContaining({
        help: "this is helpful",
      }),
      expect.anything()
    );
  });
});
