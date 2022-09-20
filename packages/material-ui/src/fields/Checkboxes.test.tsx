/**
 * @jest-environment jsdom
 */
import { FieldTester, fireEvent } from "@lastcall/react-smartform/lib/testing";
import MaterialCheckboxesHandler from "./Checkboxes";

describe("Checkboxes Handler", () => {
  const tester = new FieldTester(new MaterialCheckboxesHandler());
  const config = {
    name: "mycheckboxes",
    label: "My Checkboxes",
    type: "checkboxes" as const,
    options: [
      { value: "1", label: "One" },
      { value: "2", label: "Two" },
    ],
  };

  it("Should accept a default value", async () => {
    const { getByLabelText } = tester.render(config, {
      mycheckboxes: ["1"],
    });
    expect(getByLabelText("One")).toMatchObject({
      checked: true,
    });
  });

  it("Returns a value, even when empty", async () => {
    const { submit } = tester.render(config);
    await expect(submit()).resolves.toMatchObject({ mycheckboxes: [] });
  });

  it("Should return a value on submission", async () => {
    const { getByLabelText, submit } = tester.render(config);
    fireEvent.click(getByLabelText("Two"));
    await expect(submit()).resolves.toMatchObject({
      mycheckboxes: ["2"],
    });
  });

  it("Should validate the value and display an error message when it fails", async () => {
    const { submit, getByText } = tester.render({ ...config, required: true });
    await submit();
    getByText("My Checkboxes is a required field");
  });
});
