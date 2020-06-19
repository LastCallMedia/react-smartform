import type {
  Schema,
  SchemaHandler,
  ReactSchemaHandlerContext,
  YupSchemaHandlerContext,
  FieldHandler,
  FieldConfig,
  ConfigFromFieldHandlers,
} from "./types";
import { makeElementName } from "./util";
import React from "react";
import * as yup from "yup";

/**
 * This complicated typing allows us to extract allowed configuration
 * shapes from the field handlers, giving type checking for all passed
 * schema objects.
 *
 * H is the array of handlers that are passed in the constructor.
 * C is a union of the configuration types those handlers support.
 */
export default class SmartFormSchemaHandler<
  H extends FieldHandler[],
  C extends ConfigFromFieldHandlers<H>
> implements SchemaHandler<Schema<C>> {
  private readonly handlers: Map<string, FieldHandler>;

  constructor(handlers: H) {
    this.handlers = new Map<string, FieldHandler>();
    handlers.forEach((handler) => {
      handler.handles().forEach((type) => {
        this.handlers.set(type, handler);
      });
    });
  }
  getHandler(field: FieldConfig): FieldHandler {
    const handler = this.handlers.get(field.type);
    if (!handler) {
      throw new Error(`No handler for field type: ${field.type}`);
    }
    return handler;
  }
  getReactElement(
    schema: C[],
    context: ReactSchemaHandlerContext
  ): React.ReactElement {
    const parents = context.parents || [];

    const key = parents.length === 0 ? "root" : makeElementName(parents);
    return (
      <React.Fragment key={key}>
        {schema
          .map((config) => this.getReactElementSingle(config, context))
          .filter((e) => !!e)}
      </React.Fragment>
    );
  }
  getReactElementSingle(
    config: C,
    context: ReactSchemaHandlerContext
  ): React.ReactElement {
    const parents = context.parents || [];
    return this.getHandler(config).getReactElement(config, {
      ...context,
      parents,
      handler: this,
    });
  }

  getYupSchema(
    schema: C[],
    context: YupSchemaHandlerContext
  ): yup.ObjectSchema {
    const yupSchema = schema.reduce((yupSchema, config) => {
      const fieldSchema = this.getYupSchemaSingle(config, context);
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

  getYupSchemaSingle(
    config: C,
    context: YupSchemaHandlerContext
  ): yup.Schema<unknown> {
    const parents = context.parents || [];
    return this.getHandler(config).getYupSchema(config, {
      ...context,
      parents,
      handler: this,
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
