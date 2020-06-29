import InputHandler from "./Input";
import { FieldTester, fireEvent } from "../testing";

describe("MaterialInputHandler", () => {
  const tester = new FieldTester(new InputHandler());
  const config = {
    name: "mytext",
    type: "text" as const,
    label: "My Text",
  };

  it("Should accept a default value", async () => {
    const { getByLabelText } = tester.render(config, {
      mytext: "foo",
    });
    expect(getByLabelText("My Text")).toMatchObject({
      value: "foo",
    });
  });

  it("Returns a value, even when empty", async () => {
    const { submit } = tester.render(config);
    await expect(submit()).resolves.toMatchObject({ mytext: "" });
  });

  it("Should return a value on submission", async () => {
    const { getByLabelText, submit } = tester.render(config);
    fireEvent.input(getByLabelText("My Text"), { target: { value: "foo" } });
    await expect(submit()).resolves.toMatchObject({
      mytext: "foo",
    });
  });

  it("Should validate the value and display an error message when it fails", async () => {
    const { submit, getByText } = tester.render({ ...config, required: true });
    await submit();
    getByText("My Text is a required field");
  });
});
