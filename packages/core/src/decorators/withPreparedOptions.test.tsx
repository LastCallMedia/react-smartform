import React from "react";
import Registry from "../Registry";
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
  const lists = {
    factory: () => [{ value: "factory", label: "Factory" }],
    simple: [{ value: "simple", label: "Simple" }],
  };
  class WrappedDummy extends withPreparedOptions(Base) {}
  const tester = new FieldTester(new WrappedDummy(), {
    registry: new Registry([new WrappedDummy()], lists),
  });

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
