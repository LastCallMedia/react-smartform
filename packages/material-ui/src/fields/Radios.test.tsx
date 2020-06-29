import { FieldTester, fireEvent } from "@lastcall/react-smartform/lib/testing";
import MaterialRadiosHandler from "./Radios";

describe("Radios Handler", () => {
  const tester = new FieldTester(new MaterialRadiosHandler());
  const config = {
    name: "myradios",
    label: "My Radios",
    type: "radios" as const,
    options: [
      { value: "1", label: "One" },
      { value: "2", label: "Two" },
    ],
  };

  it("Should accept a default value", async () => {
    const { getByLabelText } = tester.render(config, {
      myradios: "1",
    });
    expect(getByLabelText("One")).toMatchObject({
      checked: true,
    });
  });

  it("Returns a value, even when empty", async () => {
    const { submit } = tester.render(config);
    await expect(submit()).resolves.toMatchObject({ myradios: "" });
  });

  it("Should return a value on submission", async () => {
    const { getByLabelText, submit } = tester.render(config);
    fireEvent.click(getByLabelText("Two")); //, { target: { value: "foo" } });
    await expect(submit()).resolves.toMatchObject({
      myradios: "2",
    });
  });

  it("Should validate the value and display an error message when it fails", async () => {
    const { submit, getByText } = tester.render({ ...config, required: true });
    await submit();
    getByText("My Radios is a required field");
  });
});
