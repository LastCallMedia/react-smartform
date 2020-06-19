import SmartFormSchemaHandler from "../SchemaHandler";
import ContainerHandler from "./Container";
import InputHandler from "./Input";
import { renderSchema, getYupSchema } from "../testing";
import * as yup from "yup";

describe("ContainerHandler", function () {
  const schemaHandler = new SmartFormSchemaHandler([
    new ContainerHandler(),
    new InputHandler(),
  ]);

  it("Should render container items", () => {
    const { container } = renderSchema(schemaHandler, [
      {
        type: "container",
        name: "myarr",
        className: "container1",
        of: [{ name: "mytext", type: "text" }],
      },
    ]);
    expect(container.querySelector("div.container1 #mytext")).not.toBeNull();
  });

  it("Should return a mergeable Yup schema", () => {
    const actual = getYupSchema(schemaHandler, [
      {
        type: "container",
        name: "mycontainer",
        of: [
          {
            type: "text",
            name: "mytext",
            required: true,
          },
        ],
      },
    ]);
    const expected = yup.object({ mytext: yup.string().required() });
    expect(actual.describe()).toEqual(expected.describe());
  });
});
