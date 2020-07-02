import React from "react";
import ArrayHandler from "./Array";
import { FieldTester, DummyHandler } from "../testing";
import * as yup from "yup";

describe("ArrayHandler", () => {
  const tester = new FieldTester(new ArrayHandler(), {
    handlers: [new DummyHandler()],
  });

  it("Should render complex array items", () => {
    const { queryAllByTestId } = tester.render({
      type: "array",
      name: "myarr",
      count: 2,
      of: [{ name: "dummy", type: "dummy" }],
    });
    expect(queryAllByTestId("myarr[0].dummy")).toHaveLength(1);
    expect(queryAllByTestId("myarr[1].dummy")).toHaveLength(1);
  });

  it("Should render simple array items", () => {
    const { queryAllByTestId } = tester.render({
      type: "array",
      name: "myarr",
      count: 2,
      of: { type: "dummy" },
    });
    expect(queryAllByTestId("myarr[0]")).toHaveLength(1);
    expect(queryAllByTestId("myarr[1]")).toHaveLength(1);
  });

  it("Should allow count to be controlled by another field", async () => {
    const config = {
      type: "array",
      name: "myarr",
      count: "ref('anotherField')",
      of: { type: "dummy" },
    };
    const { container } = tester.render(config, { anotherField: 2 });
    expect(container.querySelectorAll(".dummy-input")).toHaveLength(2);
  });

  it("Should validate simple arrays", () => {
    const actual = tester.getSchema({
      name: "myarr",
      type: "array",
      count: 1,
      of: { type: "dummy" },
    });
    const expected = yup.array().of(yup.string());
    expect(actual.describe()).toEqual(expected.describe());
  });

  it("Should validate complex arrays", () => {
    const actual = tester.getSchema({
      name: "myarr",
      type: "array",
      count: 1,
      of: [{ type: "dummy", name: "mydummy" }],
    });
    const expected = yup.array().of(yup.object({ mydummy: yup.string() }));
    expect(actual.describe()).toEqual(expected.describe());
  });

  it("Should allow a custom renderer", () => {
    let renderer;
    const handler = new ArrayHandler(
      ["array"],
      (renderer = jest.fn((props) => {
        return <span data-testid="the-array">{props.children}</span>;
      }))
    );
    const tester = new FieldTester(handler, {
      handlers: [new DummyHandler()],
    });
    const config = {
      name: "myarr",
      type: "array",
      count: 2,
      of: [{ type: "dummy", name: "the-field" }],
    };
    const { getAllByTestId } = tester.render(config);
    expect(getAllByTestId("the-array")).toHaveLength(2);
    expect(renderer).toHaveBeenCalledWith(
      expect.objectContaining({
        children: expect.any(Array),
        fields: {
          "the-field": expect.anything(),
        },
        context: expect.objectContaining({
          array: {
            config: config,
            parents: [],
            index: 0,
          },
        }),
      }),
      {}
    );
  });
});
