import {FieldConfig} from "../types";

type PatternValidation = {pattern: string, message: string}
type Validations = PatternValidation

export default interface InputConfig extends FieldConfig {
    name: string
    type: 'input'
    placeholder?: boolean
    inputType?: string
    required?: boolean
    validations?: Validations[]
}
