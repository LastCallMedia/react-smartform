import {FieldConfig, FieldHandler, ReactFieldHandlerContext, Schema, YupFieldHandlerContext} from "../types";
import React from "react";

export interface ContainerConfig extends FieldConfig {
    type: 'container'
    of: Schema
    className?: string
}

export default class ContainerHandler implements FieldHandler<ContainerConfig> {

    handles(): string[] {
        return ['container']
    }
    getReactElement(config: ContainerConfig, context: ReactFieldHandlerContext): React.ReactElement {
        return (
            <div key={config.name} className={config.className}>
                {context.handler.getReactElement(config.of, context)}
            </div>
        )
    }
    getYupSchema(config: ContainerConfig, context: YupFieldHandlerContext) {
        return context.yup.string()
    }
}
