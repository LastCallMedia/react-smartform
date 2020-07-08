import type {
  FieldConfig,
  FieldHandler,
  FieldRenderContext,
  FieldValidationContext,
  Constructor,
  RenderChildren,
} from "../types";
import type { Schema as YupSchema } from "yup";
import React from "react";
import { compile } from "expression-eval";
import { getReactEvalContext } from "../eval";
import ArrayElement from "../components/ArrayElement";

// @todo: I'd like to use Omit<FieldConfig, "name"> here, but it's not working with the
// additional properties.
export interface UnnamedFieldConfig {
  type: string;
  [k: string]: unknown;
}
export interface ArrayConfig extends FieldConfig {
  count: number | string;
  of: UnnamedFieldConfig | FieldConfig[];
}

export type ArrayRenderer<
  Config extends ArrayConfig = ArrayConfig
> = React.ComponentType<{
  items: RenderChildren[];
  context: FieldRenderContext;
  config: Config;
}>;

export default class ArrayHandler<Config extends ArrayConfig = ArrayConfig>
  implements FieldHandler<Config> {
  types: string[];
  renderer: ArrayRenderer<Config> | ArrayRenderer;
  constructor(
    types: string[] = ["array"],
    renderer: ArrayRenderer<Config> = ArrayElement
  ) {
    this.types = types;
    this.renderer = renderer;
  }
  handles(): string[] {
    return this.types;
  }

  render(config: Config, context: FieldRenderContext): React.ReactElement {
    const count = resolveCount(config.count, context);
    const { parents, builder } = context;
    const items = Array.from(Array(count).keys()).map((i) => {
      if (Array.isArray(config.of)) {
        return builder.renderFields(config.of, {
          ...context,
          parents: parents.concat([config.name, i]),
        });
      } else {
        return builder.renderFields([{ ...config.of, name: i }], {
          ...context,
          parents: parents.concat(config.name),
        });
      }
    });
    if (items.length > 0) {
      const Renderer = this.renderer;
      return <Renderer items={items} context={context} config={config} />;
    }
    return <></>;
  }

  buildYupSchema(
    config: Config,
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

export function makeArrayHandler<Config extends ArrayConfig = ArrayConfig>(
  types: string[],
  renderer: ArrayRenderer<Config>
): Constructor<ArrayHandler<Config>> {
  return class extends ArrayHandler<Config> {
    constructor() {
      super(types, renderer);
    }
  };
}
