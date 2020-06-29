import ContainerHandler from "./Container";
import { FieldTester, DummyHandler } from "../testing";
import * as yup from "yup";

describe("ContainerHandler", function () {
  const tester = new FieldTester(new ContainerHandler(), {
    handlers: [new DummyHandler()],
  });

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

  it.todo("Should allow a custom renderer");
});
