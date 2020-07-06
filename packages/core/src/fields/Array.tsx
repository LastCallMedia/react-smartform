import type {
  FieldConfig,
  FieldHandler,
  FieldRenderContext,
  FieldValidationContext,
  SchemaRenderer,
  FieldName,
  RenderContext,
  Constructor,
} from "../types";
import type { Schema as YupSchema } from "yup";
import React from "react";
import { compile } from "expression-eval";
import { getReactEvalContext } from "../eval";
import Tree from "../components/Tree";

interface ArrayRenderContext extends RenderContext {
  parent: {
    config: ArrayConfig;
    index: number;
    parents: FieldName[];
  };
}
export type ArrayRenderer = SchemaRenderer<ArrayRenderContext>;

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
  types: string[];
  renderer: ArrayRenderer;
  constructor(types: string[] = ["array"], renderer: ArrayRenderer = Tree) {
    this.types = types;
    this.renderer = renderer;
  }
  handles(): string[] {
    return this.types;
  }

  render(config: ArrayConfig, context: FieldRenderContext): React.ReactElement {
    const Renderer = this.renderer;

    const count = resolveCount(config.count, context);
    const { parents, builder } = context;
    const children = Array.from(Array(count).keys()).map((i) => {
      const arrayContext = {
        config,
        index: i,
        parents,
      };
      let fields, renderContext;
      if (Array.isArray(config.of)) {
        renderContext = {
          ...context,
          parents: parents.concat([config.name, i]),
          parent: arrayContext,
        } as ArrayRenderContext;
        fields = builder.renderFields(config.of, renderContext);
      } else {
        renderContext = {
          ...context,
          parents: parents.concat(config.name),
          parent: arrayContext,
        } as ArrayRenderContext;
        fields = builder.renderFields(
          [{ ...config.of, name: i }],
          renderContext
        );
      }
      return <Renderer key={i} fields={fields} context={renderContext} />;
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

export function makeArrayHandler(
  types: string[],
  renderer?: ArrayRenderer
): Constructor<ArrayHandler> {
  return class extends ArrayHandler {
    constructor() {
      super(types, renderer);
    }
  };
}
