import React from "react";
import type {
  Schema,
  SchemaBuilder,
  RenderContext,
  ValidationContext,
  ConfigFromFieldHandlers,
  RenderChildren,
} from "./types";
import { neverTranslate } from "./util";
import * as yup from "yup";
import type Registry from "./Registry";

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

  renderFields(schema: Config[], context: RenderContext): RenderChildren {
    if (!isValidSchema(schema)) {
      throw new Error(`Invalid schema given: ${JSON.stringify(schema)}`);
    }
    // Render the children into an object, keyed by field name.
    return schema.reduce((output, config) => {
      const fieldOutput = this.renderField(config, context);
      return { ...output, [config.name]: fieldOutput };
    }, {} as RenderChildren);
  }

  renderField(config: Config, context: RenderContext): React.ReactElement {
    const element = this.registry.getHandler(config.type).render(config, {
      parents: [], // Parents will be overridden if set on context.
      ...context,
      builder: this,
    });
    return React.cloneElement(element, { key: config.name });
  }

  buildYupSchema(
    schema: Config[],
    context: ValidationContext
  ): yup.ObjectSchema {
    if (!isValidSchema(schema)) {
      throw new Error(`Invalid schema given: ${JSON.stringify(schema)}`);
    }
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
      t: context.t ?? neverTranslate,
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

function isValidSchema(schema: unknown): schema is Schema {
  if (!schema || !Array.isArray(schema)) {
    console.log("Returning 1");
    return false;
  }
  for (const item of schema) {
    if (typeof item !== "object" || !("name" in item) || !("type" in item)) {
      return false;
    }
  }
  return true;
}
