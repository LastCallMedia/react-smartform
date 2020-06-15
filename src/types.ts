export type FieldName = string|number

/**
 * Definition for any field.
 *
 * This will be extended by more specific types, but we require that all fields have at least
 * a name and type.
 */
export interface FieldConfig {
    name: FieldName
    type: string
    [k: string]: unknown
}

/**
 * Many fields in an array are considered a Schema.
 */
export type Schema = FieldConfig[]

/**
 * A visitor is a top level class that knows how to visit an entire schema and do something
 * productive with it.
 */
export interface Visitor {
    visitSchema(schema: Schema): unknown
    visitField(field: FieldConfig): unknown
}

/**
 * A field visitor is controlled by a Visitor, and knows how to visit a single field and do
 * something productive with it.
 */
// export interface FieldVisitor {
//     visits(): string[]
//     visit(config: FieldConfig, parent: Visitor): unknown
// }




// /**
//  * Context for building React elements.
//  */
// export type ReactFormBuilderContext = {
//     form: FormContextValues
// }
//
// /**
//  * Context that is passed to individual field builders (includes builder and parents).
//  */
// export type ReactFieldBuilderContext = ReactFormBuilderContext & BuilderContext
//
// /**
//  * Context for building Yup schema.
//  */
// export type YupFormBuilderContext = {
//     yup: typeof yup
// }
// /**
//  * Context that is passed to individual field builders (includes builder and parents).
//  */
// export type YupFieldBuilderContext = YupFormBuilderContext & BuilderContext
//
// export type BuilderContext = {
//     builder: FormBuilder
// }
//
// export interface FormBuilder {
//     checkSchema(schema: Schema): void
//     buildReactForm(schema: Schema, context: ReactFormBuilderContext, parents: FieldName[]): React.ReactElement
//     buildYupSchema(schema: Schema, context: YupFormBuilderContext): yup.Schema
// }
//
// export interface FieldBuilder<T extends FieldConfig = FieldConfig> {
//     checkConfig(field: T, context: BuilderContext): void
//
//     buildReactField(field: T, context: ReactFieldBuilderContext, parents: FieldName[]): React.ReactElement
//     // A flag indicating whether this field contains any child fields.
//     hasChildren(field: T): boolean
//     // A flag indicating whether this field requires any kind of validation.
//     requiresValidation(field: T): boolean
// }
//
// export interface ValidatingFieldBuilder<T extends FieldConfig = FieldConfig> extends FieldBuilder<T> {
//     requiresValidation(): true
//     // Build a YUP validation schema for this field.
//     buildYupSchema(field: T, context: YupFieldBuilderContext): yup.Schema;
// }
