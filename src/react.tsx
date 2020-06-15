import React from "react";
import {FieldConfig, FieldName, Schema} from "./types";
import {FormContextValues} from "react-hook-form";
import {makeElementName} from "./util";

export interface ReactFieldVisitor<C extends FieldConfig = FieldConfig> {
    visits(): string[]
    visit(element: C, context: ReactFieldVisitorContext): React.ReactElement
}

export interface ReactSchemaVisitorContext {
    form: FormContextValues
    parents?: FieldName[]
}
export interface ReactFieldVisitorContext extends ReactSchemaVisitorContext {
    visitor: ReactSchemaVisitor
    parents: FieldName[]
}

export default class ReactSchemaVisitor {
    visitors: Map<string, ReactFieldVisitor>
    constructor(visitors: ReactFieldVisitor[] = []) {
        this.visitors = new Map()
        visitors.forEach(visitor => {
            this.addVisitor(visitor);
        })
    }
    addVisitor(visitor: ReactFieldVisitor) {
        visitor.visits().forEach(type => {
            this.visitors.set(type, visitor);
        })
    }
    visitSchema(schema: Schema, context: ReactSchemaVisitorContext): React.ReactElement {
        const parents = context.parents || []
        const key = parents.length === 0 ? 'root' : makeElementName(parents)
        return (
            <React.Fragment key={key}>
                {schema.map(field => this.visitField(field, context))}
            </React.Fragment>
        )
    }
    visitField(field: FieldConfig, context: ReactSchemaVisitorContext): React.ReactElement {
        const visitor = this.visitors.get(field.type)
        if(!visitor) {
            throw new Error(`Unable to find registered element type: ${field.type}`)
        }
        return visitor.visit(field, {...context, visitor: this, parents: context.parents || []});
    }
}
