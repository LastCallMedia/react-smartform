import type {
  FieldConfig,
  FieldHandler,
  FieldRenderContext,
  FieldValidationContext,
  SchemaRenderer,
  FieldName,
} from "../types";
import type { Schema as YupSchema } from "yup";
import React from "react";
import { compile } from "expression-eval";
import { getReactEvalContext } from "../eval";
import { RenderChildren, RenderContext } from "../types";

interface ArrayRenderContext extends RenderContext {
  array: {
    config: ArrayConfig;
    index: number;
    parents: FieldName[];
  };
}
export type ArrayRenderer = SchemaRenderer<RenderChildren, ArrayRenderContext>;

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
  types: string[]
  renderer?: ArrayRenderer;
  constructor(types: string[] = ['array'], renderer?: ArrayRenderer) {
    this.types = types;
    this.renderer = renderer;
  }
  handles(): string[] {
    return this.types
  }

  render(config: ArrayConfig, context: FieldRenderContext): React.ReactElement {
    const count = resolveCount(config.count, context);
    const { parents, builder } = context;
    const children = Array.from(Array(count).keys()).map((i) => {
      const arrayContext = {
        config,
        index: i,
        parents,
      };
      return Array.isArray(config.of)
        ? builder.render(config.of, {
            ...context,
            key: i,
            parents: parents.concat([config.name, i]),
            renderer: this.renderer,
            array: arrayContext,
          } as ArrayRenderContext)
        : builder.render([{ ...config.of, name: i }], {
            ...context,
            key: i,
            parents: parents.concat(config.name),
            renderer: this.renderer,
            array: arrayContext,
          } as ArrayRenderContext);
    });
    return <React.Fragment>{children}</React.Fragment>;
  }

  buildYupSchema(
    config: ArrayConfig,
    context: FieldValidationContext
  ): YupSchema<unknown> | false {
    const { builder, yup } = context;
    if (Array.isArray(config.of)) {
      return yup.array().of(builder.buildYupSchema(config.of, context));
    } else {
      const child = builder.buildYupSchemaField(
        { ...config.of, name: 0 },
        context
      );
      return child ? yup.array().of(child) : false;
    }
  }
}

function resolveCount(
  spec: ArrayConfig["count"],
  context: FieldRenderContext
): number {
  if (typeof spec === "number") {
    return spec;
  }
  if (typeof spec === "string") {
    const count = Number(compile(spec)(getReactEvalContext(context)));
    return isNaN(count) ? 0 : count;
  }
  throw new Error(`Invalid count expression given: ${spec}`);
}
