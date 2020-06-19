import {
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
  ): yup.Schema<unknown> {
    const fields = schema.reduce((collected, config) => {
      collected[config.name.toString()] = this.getYupSchemaSingle(
        config,
        context
      );
      return collected;
    }, {} as Record<string, yup.Schema<unknown>>);
    return context.yup.object(fields);
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
