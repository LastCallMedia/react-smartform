import React from "react";
import withLabelExpr from "./withLabelExpression";
import { DummyHandler, FieldTester } from "../testing";

const renderMock = jest.fn(() => <span />);
DummyHandler.prototype.render = renderMock;

describe("withLabelExpression", () => {
  class WrappedDummy extends withLabelExpr(DummyHandler) {}
  const tester = new FieldTester(new WrappedDummy());

  afterEach(() => jest.clearAllMocks());

  it("Should pass the label property through when an expression is not given", () => {
    tester.render({ type: "dummy", name: "foo", label: "foo" });
    expect(renderMock).toHaveBeenCalledWith(
      expect.objectContaining({
        label: "foo",
      }),
      expect.anything()
    );
  });

  it("Should pass the label property through when an expression is given", () => {
    tester.render({
      type: "dummy",
      name: "foo",
      labelExpr: "1 > 0 ? 'foo' : 'bar'",
    });
    expect(renderMock).toHaveBeenCalledWith(
      expect.objectContaining({
        label: "foo",
      }),
      expect.anything()
    );
  });

  it("Should override a label property with the result of the expression", () => {
    tester.render({
      type: "dummy",
      name: "foo",
      label: "default",
      labelExpr: "'foo'",
    });
    expect(renderMock).toHaveBeenCalledWith(
      expect.objectContaining({
        label: "foo",
      }),
      expect.anything()
    );
  });

  it("Should leave the prior label if the expression returns anything other than a string.", () => {
    tester.render({
      type: "dummy",
      name: "foo",
      label: "default",
      labelExpr: "",
    });

    expect(renderMock).toHaveBeenCalledWith(
      expect.objectContaining({
        label: "default",
      }),
      expect.anything()
    );
  });

  it("Should leave the prior label if the expression returns an empty string", () => {
    tester.render({
      type: "dummy",
      name: "foo",
      label: "default",
      labelExpr: "''",
    });

    expect(renderMock).toHaveBeenCalledWith(
      expect.objectContaining({
        label: "default",
      }),
      expect.anything()
    );
  });
});
