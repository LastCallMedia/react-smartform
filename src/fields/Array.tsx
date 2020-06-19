import type {
  FieldConfig,
  FieldHandler,
  ReactFieldHandlerContext,
  YupFieldHandlerContext,
} from "../types";
import type { Schema as YupSchema } from "yup";
import { resolveFieldName } from "../util";
import React from "react";

// @todo: I'd like to use Omit<FieldConfig, "name"> here, but it's not working with the
// additional properties.
interface UnnamedFieldConfig {
  type: string;
  [k: string]: unknown;
}
export interface ArrayConfig extends FieldConfig {
  count: number | string;
  of: UnnamedFieldConfig | FieldConfig[];
}

export default class ArrayHandler implements FieldHandler<ArrayConfig> {
  handles(): string[] {
    return ["array"];
  }

  getReactElement(
    config: ArrayConfig,
    context: ReactFieldHandlerContext
  ): React.ReactElement {
    const count = resolveCount(config.count, context);
    const { parents, handler } = context;
    const children = Array.from(Array(count).keys()).map((i) => {
      return Array.isArray(config.of)
        ? handler.getReactElement(config.of, {
            ...context,
            parents: parents.concat([config.name, i]),
          })
        : handler.getReactElementSingle(
            { ...config.of, name: i },
            {
              ...context,
              parents: parents.concat(config.name),
            }
          );
    });
    return <React.Fragment>{children}</React.Fragment>;
  }

  getYupSchema(
    config: ArrayConfig,
    context: YupFieldHandlerContext
  ): YupSchema<unknown> {
    const { handler } = context;
    const children = Array.isArray(config.of)
      ? handler.getYupSchema(config.of, context)
      : handler.getYupSchemaSingle({ ...config.of, name: 0 }, context);
    return context.yup.array().of(children);
  }
}

function resolveCount(
  spec: ArrayConfig["count"],
  context: ReactFieldHandlerContext
): number {
  if (typeof spec === "number") {
    return spec;
  }
  const match = spec.match(/^value\((.*)\)$/);
  if (match) {
    const remoteField = resolveFieldName(context.parents, match[1]);
    const value = parseInt(context.form.watch(remoteField));
    return isNaN(value) ? 0 : value;
  }
  throw new Error(`Unable to resolve count from '${spec}'`);
}
