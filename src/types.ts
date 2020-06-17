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
    when?: string
    [k: string]: unknown
}

/**
 * Many fields in an array are considered a Schema.
 */
export type Schema = FieldConfig[]
