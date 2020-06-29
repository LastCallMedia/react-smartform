import React from "react";
import type {
  FieldHandler,
  FieldConfig,
  FieldRenderContext,
  FieldValidationContext,
  ExtractConfigFromHandler,
} from "../types";
import type {
  EvalContext
} from "../eval";
import { eval as evalExpr } from "expression-eval";
import set from "lodash/set";
import get from "lodash/get";
import jsep, {
  BinaryExpression,
  CallExpression,
  Expression,
  Identifier,
  Literal,
  LogicalExpression,
  Compound, MemberExpression, UnaryExpression
} from "jsep";
import { Constructor } from "../types";
import { evaluateInRenderContext } from "../eval";
import * as yup from "yup";

export interface VisibilityConfig extends FieldConfig {
  when?: string;
}

/**
 * This decorator adds advanced visibility conditions.
 */
export default function withVisibility<
  HandlerConstructor extends Constructor<FieldHandler>,
  HandlerInstance extends InstanceType<HandlerConstructor>,
  HandlerConfig extends ExtractConfigFromHandler<HandlerInstance>,
  Config extends HandlerConfig & VisibilityConfig
>(
  constructor: HandlerConstructor
): Constructor<FieldHandler<Config>> {
  return class extends constructor {
    render(config: Config, context: FieldRenderContext) {
      if (config.when) {
        const result = evaluateInRenderContext(config.when, context);
        if (!result) {
          return <React.Fragment></React.Fragment>;
        }
      }
      return super.render(config, context);
    }
    buildYupSchema(
      config: Config,
      context: FieldValidationContext
    ) {
      let schema = super.buildYupSchema(config, context);
      if (schema === false) {
        return false;
      }
      if (config.when) {
        if(typeof config.when !== 'string') {
          throw new Error(`Unable to evaluate expression: ${JSON.stringify(config.when)}`)
        }
        const ast = jsep(config.when);
        const refs = extractRefs(ast);
        const isFn = (...values: unknown[]) => {
          // Extract values from our values array into an object we can descend into.
          const packed = refs.reduce((p, fieldName, i) => {
            set(p, fieldName, values[i]);
            return p;
          }, {});
          return !!evalExpr(ast, getYupEvalContext(packed));
        };

        // If we're being asked to merge the schema up to the next level (eg: for containers), we need to apply
        // the when condition to the subfields of the object schema we're working with instead of the object
        // itself.
        if(schema.type === 'object' && schema.meta() && 'mergeUp' in schema.meta() && (schema as yup.ObjectSchema).fields) {
          const typedSchema = (schema as yup.ObjectSchema<object>);
          const shape = Object.entries(typedSchema.fields).reduce((shape, [key, subschema]) => {
            shape[key] = context.yup.mixed().when(refs, {
              is: isFn,
              then: subschema
            });

            return shape
          }, {} as Record<string, yup.Schema<unknown>>);
          return typedSchema.shape(shape).meta(schema.meta);
        }

        schema = context.yup
          .mixed()
          .when(refs, {
            is: isFn,
            then: schema,
          })
          .meta(schema.meta());
      }
      return schema;
    }
  };
}

export function getYupEvalContext(
  refValues: Record<string, unknown>
): EvalContext {
  return {
    ref: (path: string) => {
      return get(refValues, path);
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
    Array(value: unknown): unknown[] {
      return Array.isArray(value) ? value : [value];
    }
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
        extractRefs((ast as CallExpression).callee),
        ...(ast as CallExpression).arguments.map((a) => extractRefs(a)),
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
    case 'MemberExpression':
      return [...extractRefs((ast as MemberExpression).object)]

    case "Literal":
    case "Identifier":
      return [];
    case "Compound":
      return ([] as string[]).concat(
        ... (ast as Compound).body.map(extractRefs)
      );
    case 'UnaryExpression':
      return extractRefs((ast as UnaryExpression).argument);
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
    case "MemberExpression":
      return false;
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
