import {
  Schema,
  SchemaHandler,
  ReactSchemaHandlerContext,
  YupSchemaHandlerContext,
  FieldHandler,
  FieldConfig,
} from "./types";
import { makeElementName } from "./util";
import React from "react";
import * as yup from "yup";

// Unpacks a typed array into a union of types
type Unpacked<T> = T extends (infer U)[] ? U : never;
// Extracts the configuration type for a single FieldHandler.
type ExtractConfigFromHandler<T> = T extends FieldHandler
  ? Parameters<T["getReactElement"]>[0]
  : never;
// Extracts a union configuration type for an array of FieldHandlers
type ExtractConfigFromHandlers<T> = ExtractConfigFromHandler<Unpacked<T>>;

/**
 * This complicated typing allows us to extract
 */
export default class SmartFormSchemaHandler<
  H extends FieldHandler[],
  C extends ExtractConfigFromHandlers<H>
> implements SchemaHandler {
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
    schema: C | C[],
    context: ReactSchemaHandlerContext
  ): React.ReactElement {
    const parents = context.parents || [];

    const buildField = (field: FieldConfig) =>
      this.getHandler(field).getReactElement(field, {
        ...context,
        parents,
        handler: this,
      });
    if (Array.isArray(schema)) {
      const key = parents.length === 0 ? "root" : makeElementName(parents);
      return (
        <React.Fragment key={key}>
          {schema.map(buildField).filter((e) => !!e)}
        </React.Fragment>
      );
    }
    return buildField(schema);
  }
  getYupSchema(
    schema: C | C[],
    context: YupSchemaHandlerContext
  ): yup.Schema<unknown> {
    const parents = context.parents || [];
    const buildField = (field: FieldConfig) =>
      this.getHandler(field).getYupSchema(field, {
        ...context,
        parents,
        handler: this,
      });

    if (Array.isArray(schema)) {
      const fields = schema.reduce((collected, field) => {
        collected[field.name.toString()] = this.getHandler(
          field
        ).getYupSchema(field, { ...context, parents, handler: this });
        return collected;
      }, {} as Record<string, yup.Schema<unknown>>);
      return context.yup.object(fields);
    }

    return buildField(schema);
  }
}
