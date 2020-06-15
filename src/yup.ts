import yup from 'yup'
import {FieldConfig, FieldName, Schema} from "./types";

export interface YupFieldVisitor<C extends FieldConfig = FieldConfig> {
    visits(): string[]
    visit(config: C, context: YupFieldVisitorContext): yup.Schema<any>
}

export interface YupSchemaVisitorContext {
    yup: typeof yup
    parents?: FieldName[]
}

export interface YupFieldVisitorContext extends YupSchemaVisitorContext {
    visitor: YupSchemaVisitor
    parents: (string|number)[]
}

export default class YupSchemaVisitor {
    visitors: Map<string, YupFieldVisitor>
    constructor(visitors: YupFieldVisitor[] = []) {
        this.visitors = new Map()
        visitors.forEach(visitor => this.addVisitor(visitor))
    }
    addVisitor(visitor: YupFieldVisitor) {
        visitor.visits().forEach(type => {
            this.visitors.set(type, visitor)
        })
    }
    visitSchema(schema: Schema, context: YupSchemaVisitorContext): yup.ObjectSchema {
        const fields = schema
            .reduce((collected, field) => {
                collected[field.name.toString()] = this.visitField(field, context);
                return collected
            }, {} as Record<string, yup.Schema<any>>)
        return context.yup.object(fields);
    }
    visitField(field: FieldConfig, context: YupSchemaVisitorContext): yup.Schema<any> {
        const visitor = this.visitors.get(field.type)
        if(!visitor) {
            throw new Error(`Unable to find registered element type: ${field.type}`)
        }
        return visitor.visit(field, {...context, visitor: this, parents: context.parents || []});
    }
}
