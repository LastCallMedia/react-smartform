import React from "react";
import ContainerHandler from "./Container";
import { FieldTester, DummyHandler } from "../testing";
import * as yup from "yup";
import Tree from "../components/Tree";

describe("ContainerHandler", function () {
  const renderer = jest.fn(Tree);
  const tester = new FieldTester(
    new ContainerHandler(["container"], renderer),
    {
      handlers: [new DummyHandler()],
    }
  );

  it("Should render container items", () => {
    const { getByTestId } = tester.render({
      type: "container",
      name: "myarr",
      className: "container1",
      of: [{ name: "mytext", type: "dummy" }],
    });
    expect(getByTestId("mytext"));
  });

  it("Should return a mergeable Yup schema", () => {
    const actual = tester.getSchema({
      type: "container",
      name: "mycontainer",
      of: [
        {
          type: "dummy",
          name: "mytext",
        },
      ],
    });
    const expected = yup
      .object({ mytext: yup.string() })
      .meta({ mergeUp: true });
    expect(actual.describe()).toEqual(expected.describe());
  });

  it("Should allow a custom renderer", () => {
    renderer.mockImplementation(() => <span data-testid="the-container" />);
    const containerConfig = {
      type: "container" as const,
      name: "myarr",
      className: "container1",
      of: [{ name: "the-field", type: "dummy" }],
    };
    const { getByTestId } = tester.render(containerConfig);
    expect(getByTestId("the-container")).toBeTruthy();
    expect(renderer).toHaveBeenCalledWith(
      expect.objectContaining({
        fields: expect.objectContaining({
          "the-field": expect.anything(),
        }),
        context: expect.any(Object),
        config: containerConfig,
      }),
      {}
    );
  });
});
