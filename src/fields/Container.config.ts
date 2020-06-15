import {FieldConfig, Schema} from "../types";

export interface ContainerConfig extends FieldConfig {
    type: 'container'
    of: Schema
    className?: string
}
