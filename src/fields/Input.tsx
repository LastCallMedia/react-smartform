import {FieldConfig, FieldHandler, ReactFieldHandlerContext, YupFieldHandlerContext} from "../types";
import {makeElementId, makeElementLabel, makeElementName} from "../util";
import React from "react";

export interface InputConfig extends FieldConfig {
    name: string
    type: 'text'|'number'|'tel'|'password'
    placeholder?: boolean
    required?: boolean
}

export default class InputHandler implements FieldHandler<InputConfig> {
    handles(): string[] {
        return ['text', 'number', 'tel', 'password']
    }
    getReactElement(config: InputConfig, context: ReactFieldHandlerContext): React.ReactElement {
        const name = makeElementName(context.parents.concat([config.name]));
        const id = makeElementId(context.parents.concat(config.name))
        const label = makeElementLabel(context.parents.concat(config.name), 'label');
        return (
            <div key={config.name}>
                <label htmlFor={id}>{label}</label>
                <input
                    id={id}
                    name={name}
                    placeholder={config.placeholder ? makeElementLabel(context.parents.concat(config.name), 'placeholder'): undefined}
                    type={config.type}
                    ref={context.form.register()}
                />
            </div>

        )
    }
    getYupSchema(config: InputConfig, context: YupFieldHandlerContext) {
        let schema = context.yup.string()
        if(config.required) {
            schema = schema.required()
        }
        return schema
    }
}
