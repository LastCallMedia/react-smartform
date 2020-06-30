import React from "react";
import { DummyHandler, FieldTester, DummyConfig } from "../testing";
import { OptionList, FieldRenderContext } from "../types";
import withPreparedOptions from "./withPreparedOptions";

class Base extends DummyHandler {
  render(
    config: DummyConfig & { options: OptionList },
    context: FieldRenderContext
  ): React.ReactElement {
    return super.render(config, context);
  }
}
const renderMock = jest.fn(() => <span />);
DummyHandler.prototype.render = renderMock;

describe("withPreparedOptions", () => {
  const factory = (name: string) => {
    switch (name) {
      case "simple":
        return [{ value: "simple", label: "Simple" }];
      default:
        throw new Error(`Unknown option set: ${name}`);
    }
  };
  class WrappedDummy extends withPreparedOptions(Base, factory) {}
  const tester = new FieldTester(new WrappedDummy());

  afterEach(() => jest.clearAllMocks());

  it("Should pass a regular options array through.", () => {
    tester.render({
      type: "dummy",
      name: "foo",
      options: [{ value: "foo", label: "Foo" }],
    });
    expect(renderMock).toHaveBeenCalledWith(
      expect.objectContaining({
        options: [{ value: "foo", label: "Foo" }],
      }),
      expect.anything()
    );
  });

  it("Should be capable of fetching an option list from the registry", () => {
    tester.render({
      type: "dummy",
      name: "foo",
      options: "simple",
    });
    expect(renderMock).toHaveBeenCalledWith(
      expect.objectContaining({
        options: [{ label: "Simple", value: "simple" }],
      }),
      expect.anything()
    );
  });
});
