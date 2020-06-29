import {
  queryHelpers,
  buildQueries,
  Matcher,
  SelectorMatcherOptions,
} from "@testing-library/react";

export type AllByText = (
  container: HTMLElement,
  id: Matcher,
  options?: SelectorMatcherOptions
) => HTMLElement[];

const queryAllByName: AllByText = (...args) =>
  queryHelpers.queryAllByAttribute("name", ...args);
const getNameMultipleError = (c: unknown, name: string) =>
  `Found multiple elements matching name: ${name}`;
const getNameMissingError = (c: unknown, name: string) =>
  `Unable to find an element with name: ${name}`;
const [
  queryByName,
  getAllByName,
  getByName,
  findAllByName,
  findByName,
] = buildQueries(queryAllByName, getNameMultipleError, getNameMissingError);

export {
  queryByName,
  queryAllByName,
  getAllByName,
  getByName,
  findAllByName,
  findByName,
};
