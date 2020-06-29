import React from "react";
import {
  render,
  RenderOptions,
  queries,
  RenderResult,
} from "@testing-library/react";
import * as customQueries from "./queries";

// Override render() to provide additional queries, such as *ByName().
const allQueries = { ...queries, ...customQueries };
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "queries">
): RenderResult<typeof allQueries> =>
  render(ui, { queries: allQueries, ...options });

export * from "@testing-library/react";
export { customRender as render };
export * from "./tester";
export * from "./DummyHandler";
