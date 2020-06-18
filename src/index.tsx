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

export default class SmartFormSchemaHandler implements SchemaHandler {
  handlers: Map<string, FieldHandler>;

  constructor(handlers: FieldHandler[] = []) {
    this.handlers = new Map<string, FieldHandler>();
    handlers.forEach((handler) => this.addHandler(handler));
  }
  addHandler(handler: FieldHandler): void {
    handler.handles().forEach((type) => {
      this.handlers.set(type, handler);
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
    schema: Schema | FieldConfig,
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
    schema: Schema | FieldConfig,
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
