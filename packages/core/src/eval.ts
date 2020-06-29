import { FieldRenderContext } from "./types";
import { compile } from "expression-eval";
import { makeElementName } from "./util";

export interface EvalContext {
  ref(name: string): unknown;
  isArray(value: unknown): boolean;
  Number(value: unknown): number;
  String(value: unknown): string;
  Array(value: unknown): unknown[];
}

export function evaluateInRenderContext(
  expression: string,
  context: FieldRenderContext
): unknown {
  if (typeof expression !== "string") {
    throw new Error(
      `Unable to evaluate expression: ${JSON.stringify(expression)}`
    );
  }
  const evalContext = getReactEvalContext(context);
  return compile(expression)(evalContext);
}

export function getReactEvalContext(context: FieldRenderContext): EvalContext {
  return {
    ref: (name: unknown) => {
      if (typeof name !== "string") {
        throw new Error(`Invalid ref() passed: ${name}`);
      }
      const fqn = makeElementName(context.parents.concat([name]));
      return context.form.watch(fqn);
    },
    isArray(value: unknown) {
      return Array.isArray(value);
    },
    Number(value: unknown) {
      return Number(value);
    },
    String(value: unknown) {
      return String(value);
    },
    Array(value: unknown) {
      return Array.isArray(value) ? value : [value];
    },
  };
}
