/**
 * @jest-environment jsdom
 */
import MaterialSelectHandler from "./Select";
import {
  FieldTester,
  fireEvent,
  act,
} from "@lastcall/react-smartform/lib/testing";

describe("MaterialSelectHandler", () => {
  const tester = new FieldTester(new MaterialSelectHandler());

  const config = {
    type: "select" as const,
    name: "myselect",
    label: "My Select",
    options: [
      { label: "One", value: "1" },
      { label: "Two", value: "2" },
    ],
  };

  it("Should accept a default value", async () => {
    const { getByName } = tester.render(config, {
      myselect: "1",
    });
    expect(getByName("myselect")).toMatchObject({
      value: "1",
    });
  });

  it("Returns a value, even when empty", async () => {
    const { submit } = tester.render(config);
    await expect(submit()).resolves.toMatchObject({ myselect: "" });
  });

  it("Should return a value on submission", async () => {
    const { getByRole, getAllByRole, submit } = tester.render(config);

    fireEvent.mouseDown(getByRole("button"));
    act(function () {
      const options = getAllByRole("option");
      fireEvent.mouseDown(options[0]);
      options[0].click();
    });
    await expect(submit()).resolves.toMatchObject({
      myselect: "1",
    });
  });

  it("Should validate the value and display an error message when it fails", async () => {
    const { submit, getByText } = tester.render({ ...config, required: true });
    await submit();
    getByText("My Select is a required field");
  });
});
