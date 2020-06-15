import {FieldConfig} from "../types";

export default interface ArrayConfig extends FieldConfig {
    count: number|string
    of: Omit<FieldConfig, 'name'> | FieldConfig[]
}
