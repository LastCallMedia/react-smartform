import React from "react";
import {FieldConfig, FieldName, Schema} from "./types";
import {FormContextValues} from "react-hook-form";
import {makeElementName} from "./util";

export type ReactParents = (string|number)[]
export interface ReactFieldVisitor<C extends FieldConfig = FieldConfig> {
    visits(): string[]
    visit(element: C, context: ReactFieldVisitorContext): React.ReactElement
}

export interface ReactVisitorContext {
    form: FormContextValues
    parents?: FieldName[]
}
export interface ReactFieldVisitorContext extends ReactVisitorContext {
    visitor: ReactVisitor
    parents: FieldName[]
}

export default class ReactVisitor {
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
    visitSchema(schema: Schema, context: ReactVisitorContext): React.ReactElement {
        const parents = context.parents || []
        const key = parents.length === 0 ? 'root' : makeElementName(parents)
        return (
            <React.Fragment key={key}>
                {schema.map(field => this.visitField(field, context))}
            </React.Fragment>
        )
    }
    visitField(field: FieldConfig, context: ReactVisitorContext): React.ReactElement {
        const visitor = this.visitors.get(field.type)
        if(!visitor) {
            throw new Error(`Unable to find registered element type: ${field.type}`)
        }
        return visitor.visit(field, {...context, visitor: this, parents: context.parents || []});
    }
}
