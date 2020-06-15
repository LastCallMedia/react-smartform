import {FieldConfig} from "../types";

type PatternValidation = {pattern: string, message: string}
type Validations = PatternValidation

export default interface InputConfig extends FieldConfig {
    name: string
    inputType: string
    required?: boolean
    validations: Validations[]
}
