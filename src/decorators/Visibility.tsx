import React from "react";
import type {
  FieldHandler,
  FieldConfig,
  ReactFieldHandlerContext,
  YupFieldHandlerContext,
  ExtractConfigFromHandler,
} from "../types";
import type { Schema as YupSchema } from "yup";
import { compile, eval as evalExpr } from "expression-eval";
import { resolveFieldName } from "../util";
import set from "lodash/set";
import get from "lodash/get";
import jsep, {
  BinaryExpression,
  CallExpression,
  Expression,
  Identifier,
  Literal,
  LogicalExpression,
} from "jsep";

export interface VisibilityConfig extends FieldConfig {
  when?: string;
}

export default class VisibilityDecorator<
  I extends FieldHandler,
  C extends ExtractConfigFromHandler<I>
> implements FieldHandler {
  private readonly inner: FieldHandler;

  constructor(inner: I) {
    this.inner = inner;
  }

  handles(): string[] {
    return this.inner.handles();
  }

  getReactElement(
    config: C & VisibilityConfig,
    context: ReactFieldHandlerContext
  ): React.ReactElement {
    if (config.when) {
      if (!compile(config.when)(getReactEvalContext(context))) {
        return <React.Fragment key={config.name}></React.Fragment>;
      }
    }
    return this.inner.getReactElement(config, context);
  }
  getYupSchema(
    config: C & VisibilityConfig,
    context: YupFieldHandlerContext
  ): YupSchema<unknown> {
    let schema = this.inner.getYupSchema(config, context);
    if (config.when) {
      const ast = jsep(config.when);
      const refs = extractRefs(ast);
      schema = context.yup
        .mixed()
        .when(refs, {
          is: (...values) => {
            // Extract values from our values array into an object we can descend into.
            const packed = refs.reduce((p, fieldName, i) => {
              set(p, fieldName, values[i]);
              return p;
            }, {});

            return !!evalExpr(ast, getYupEvalContext(packed));
          },
          then: schema,
        })
        .meta(schema.meta());
    }
    return schema;
  }
}

interface EvalContext {
  ref(name: string): unknown;
  Number(value: unknown): number;
  String(value: unknown): string;
}

export function getReactEvalContext(
  context: ReactFieldHandlerContext
): EvalContext {
  return {
    ref: (name: string) => {
      return context.form.watch(resolveFieldName(context.parents, name));
    },
    Number(value: unknown) {
      return Number(value);
    },
    String(value: unknown) {
      return String(value);
    },
  };
}

export function getYupEvalContext(
  refValues: Record<string, unknown>
): EvalContext {
  return {
    ref: (path: string) => {
      return get(refValues, path);
    },
    Number(value: unknown) {
      return Number(value);
    },
    String(value: unknown) {
      return String(value);
    },
  };
}

/**
 * Extract the arguments for any ref() calls in the expression.
 */
function extractRefs(ast: Expression): string[] {
  switch (ast.type) {
    case "CallExpression":
      const callee = extractCallee(ast);
      if (callee === "ref") {
        return (ast as CallExpression).arguments.reduce((refs, arg) => {
          refs.push(extractValue(arg).toString());
          return refs;
        }, [] as string[]);
      }
      return ([] as string[]).concat(
        ...(ast as CallExpression).arguments.map((a) => extractRefs(a))
      );
    case "LogicalExpression":
      return ([] as string[]).concat(
        extractRefs((ast as LogicalExpression).left),
        extractRefs((ast as LogicalExpression).right)
      );
    case "BinaryExpression":
      return ([] as string[]).concat(
        extractRefs((ast as BinaryExpression).left),
        extractRefs((ast as BinaryExpression).right)
      );
    case "Literal":
      return [];
    default:
      throw new Error(`Unhandled Type: ${ast.type}`);
  }
}

/**
 * Extract the function name from a call expression.
 */
function extractCallee(ast: Expression) {
  switch (ast.type) {
    case "CallExpression":
      return extractIdentifier((ast as CallExpression).callee);
    default:
      throw new Error(`Unable to extract callee from ${ast.type}`);
  }
}

/**
 * Extract an identifier value for any Identifier expression.
 */
function extractIdentifier(ast: Expression) {
  switch (ast.type) {
    case "Identifier":
      return (ast as Identifier).name;
    default:
      throw new Error(`Unable to extract identifier from ${ast.type}`);
  }
}

/**
 * Extract literal values for any literal expression.
 */
function extractValue(ast: Expression) {
  switch (ast.type) {
    case "Literal":
      return (ast as Literal).value;
    default:
      throw new Error(`Unable to extract value from ${ast.type}`);
  }
}
