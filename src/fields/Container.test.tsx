import SmartFormSchemaHandler from "../index";
import ContainerHandler from "./Container";
import InputHandler from "./Input";
import { renderSchema } from "../testing";

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
});
