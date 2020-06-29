import type {
  Schema,
  SchemaBuilder,
  RenderContext,
  ValidationContext,
  ConfigFromFieldHandlers,
  SchemaRenderer,
  RenderChildren,
  OptionList,
  TranslationFunction,
} from "./types";
import { makeElementName } from "./util";
import React from "react";
import * as yup from "yup";
import Registry from "./Registry";

/**
 * This complicated typing allows us to extract allowed configuration
 * shapes from the field handlers, giving type checking for all passed
 * schema objects.
 *
 * H is the array of handlers that are passed in the constructor.
 * C is a union of the configuration types those handlers support.
 */
export default class SmartFormSchemaBuilder<
  ActualRegistry extends Registry,
  Config extends ConfigFromFieldHandlers<ActualRegistry["handlers"]>
> implements SchemaBuilder<Schema<Config>> {
  private registry: ActualRegistry;

  constructor(registry: ActualRegistry) {
    this.registry = registry;
  }

  getOptionList(name: string): OptionList {
    return this.registry.getOptionList(name);
  }

  render(schema: Config[], context: RenderContext): React.ReactElement {
    const parents = context.parents || [];
    const key = context.key ?? parents.length === 0 ? 'root' : makeElementName(parents);

    // Render the children into an object, keyed by field name.
    const children = schema.reduce((output, config) => {
      const fieldOutput = this.renderField(config, context);
      return { ...output, [config.name]: fieldOutput };
    }, {} as RenderChildren);

    // Use the chosen renderer to render the children.
    const render = context.renderer ? context.renderer : defaultRenderer;

    // Tack the key onto the element at the end so we don't end up with duplicate key errors.
    return React.cloneElement(render(children, context), { key });
  }
  renderField(config: Config, context: RenderContext): React.ReactElement {
    const parents = context.parents || [];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { renderer, t, ...restOfContext } = context;
    const element = this.registry.getHandler(config.type).render(config, {
      // Do not pass renderer through. We reset at each level of recursion.
      ...restOfContext,
      parents,
      builder: this,
      t: context.t ?? defaultTranslation,
    });
    return React.cloneElement(element, { key: config.name });
  }

  buildYupSchema(
    schema: Config[],
    context: ValidationContext
  ): yup.ObjectSchema {
    const yupSchema = schema.reduce((yupSchema, config) => {
      const fieldSchema = this.buildYupSchemaField(config, context);
      if (fieldSchema === false) {
        return yupSchema;
      }
      const metadata = fieldSchema.meta();
      // If we've been requested to merge this object upward, do so, and remove
      // the metadata that tells us to do that.
      if (typeof metadata === "object" && metadata.mergeUp) {
        return yupSchema.concat(
          omitMeta(fieldSchema, "mergeUp") as yup.ObjectSchema
        );
      }
      return yupSchema.shape({ [config.name.toString()]: fieldSchema });
    }, context.yup.object());
    return yupSchema;
  }

  buildYupSchemaField(
    config: Config,
    context: ValidationContext
  ): yup.Schema<unknown> | false {
    const parents = context.parents || [];
    return this.registry.getHandler(config.type).buildYupSchema(config, {
      ...context,
      parents,
      builder: this,
      t: context.t ?? defaultTranslation,
    });
  }
}

type YupSchemaWithMetaObj = yup.Schema<unknown> & {
  _meta?: Record<string, unknown>;
};
function omitMeta<T extends yup.Schema<unknown>>(schema: T, key: string): T {
  const meta = { ...schema.meta() };
  if (
    meta &&
    typeof meta === "object" &&
    key in (meta as Record<string, unknown>)
  ) {
    const replacement = schema.clone();
    delete meta[key];
    if (Object.keys(meta).length > 0) {
      (replacement as YupSchemaWithMetaObj)._meta = meta;
    } else {
      (replacement as YupSchemaWithMetaObj)._meta = undefined;
    }
    return replacement;
  }
  return schema;
}

const defaultTranslation: TranslationFunction = (key: string) => {
  return key;
};

const defaultRenderer: SchemaRenderer = (children: RenderChildren) => {
  return <React.Fragment>{Object.values(children)}</React.Fragment>;
};
