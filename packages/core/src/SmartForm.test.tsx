import React from "react";
import { render } from "./testing";
import SmartForm from "./SmartForm";
import SmartFormSchemaBuilder from "./SchemaBuilder";
import Registry from "./Registry";
import { SchemaRenderer, SchemaRenderProps } from "./types";

const FunctionalRenderer: SchemaRenderer = jest.fn((props) => {
  const { context, children } = props;
  const onSubmit = jest.fn();
  return (
    <form onSubmit={context.form.handleSubmit(onSubmit)}>
      {Object.values(children)}
      <input type="submit" data-testid="the-submit" value="submit" />
    </form>
  );
});
class ClassRenderer extends React.Component<SchemaRenderProps> {
  render() {
    const { context, children } = this.props;
    const onSubmit = jest.fn();
    return (
      <form onSubmit={context.form.handleSubmit(onSubmit)}>
        {Object.values(children)}
        <input type="submit" data-testid="the-submit" value="submit" />
      </form>
    );
  }
}

describe("SmartForm", function () {
  const registry = new Registry([]);
  const handler = new SmartFormSchemaBuilder(registry);

  afterEach(() => jest.clearAllMocks());

  it("Can render with a functional renderer", function () {
    const { getByTestId } = render(
      <SmartForm handler={handler} schema={[]} renderer={FunctionalRenderer} />
    );
    getByTestId("the-submit");
  });

  it("Can render with a class renderer", function () {
    const { getByTestId } = render(
      <SmartForm handler={handler} schema={[]} renderer={ClassRenderer} />
    );
    getByTestId("the-submit");
  });

  it("Forwards rest props to renderer", function () {
    render(
      <SmartForm
        handler={handler}
        schema={[]}
        renderer={FunctionalRenderer}
        foo={"bar"}
      />
    );
    expect(FunctionalRenderer).toHaveBeenCalledWith(
      expect.objectContaining({
        foo: "bar",
      }),
      {}
    );
  });
});
