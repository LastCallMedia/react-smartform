import {FieldConfig, FieldHandler, ReactFieldHandlerContext, YupFieldHandlerContext} from "../types";
import {makeElementId, makeElementLabel, makeElementName} from "../util";
import React from "react";

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


export default class InputHandler implements FieldHandler<InputConfig> {
    handles(): string[] {
        return ['input']
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
                    type={config.inputType || 'text'}
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
        for(const validation of config.validations ?? []) {
            if(validation.pattern) {
                schema = schema.matches(new RegExp(validation.pattern), validation.message);
            }
        }
        return schema
    }
}
